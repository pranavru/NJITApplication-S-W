import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer
} from "@react-google-maps/api";
import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';
import LoadingOverlay from 'react-loading-overlay';

const MapComponent = (props) => {

    const mapContainerStyle = { height: window.innerHeight, width: props.details ? "55vw" : "77.5vw", left: props.details ? "45vw" : "22.5vw" };
    const mapOptions = { disableDefaultUI: true, zoomControl: true };
    const center = props.center;
    const GOOGLE_API_KEY = 'AIzaSyABBr3dtnI6vkHnyzMjztupIDjhxNXCmng';

    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const [mapR, setMap] = React.useState(null);
    const onLoad = React.useCallback(function callback(map1) {
        const bounds = new window.google.maps.LatLngBounds(props.center);
        map1.fitBounds(bounds);
        setMap(map1);
    }, [])

    //Data Loading
    const [selected, setSelected] = React.useState(null);
    const [mapMarkersData, setMapMarkerData] = React.useState([]);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    const createKey = (location) => location.lat + location.long;

    //Markers
    const MarkerData = (data, clusterer) => {
        if (data !== undefined) {
            return (
                data.map(mapVuzix =>
                    <Marker
                        onMouseOver={hoverMarker(setSelected, mapVuzix, props)}
                        onMouseOut={() => setSelected(null)}
                        key={createKey(mapVuzix)}
                        animation={mapVuzix.visible ? window.google.maps.Animation.BOUNCE : null}
                        position={{ lat: mapVuzix.lat, lng: mapVuzix.long }}
                        icon={{ url: iconImage(mapVuzix) }}
                        clusterer={clusterer}
                    />
                )
            );
        }
        else
            return (<div></div>);
    }

    const logBounds = () => {
        setMapMarkerData();
        const bounds = mapR.getBounds();
        const marks = [];
        props.markersMap.vuzixMap
            .filter(m => bounds.contains(new window.google.maps.LatLng(m.lat, m.long)))
            .map(m => {
                marks.push(m);
            })
        setMapMarkerData(marks)
        props.loadDetailedDivData(marks);
        props.activateLoader(false);
    }

    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 19, gridSize: 60, ignoreHidden: true };
    return (
        <LoadingOverlay
            active={props.isActive}
            spinner
            text='Loading...'
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                clickableIcons={false}
                options={mapOptions}
                onLoad={onLoad}
                onIdle={() => {
                    props.activateLoader(true);
                    logBounds();
                }}
                onDragStart={() => props.activateLoader(true)}
                onZoomChanged={() => props.activateLoader(true)}
            >
                <MarkerClusterer options={clusterOptions}>
                    {clusterer => MarkerData(mapMarkersData, clusterer)}
                </MarkerClusterer>
                {selected ? customInfoWindow(selected, setSelected, props) : null}
            </GoogleMap>
        </LoadingOverlay >
    );
}

export default MapComponent;

function iconImage(mapVuzix) {
    return mapVuzix.speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
        mapVuzix.speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
            !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerN.svg" :
                (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : "/markerN.svg";
}

function hoverMarker(setSelected, mapVuzix, props) {
    return () => {
        setSelected(mapVuzix);
        props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long, 3);
    };
}

function customInfoWindow(selected, setSelected, props) {
    return <InfoWindow
        position={{ lat: selected.lat, lng: selected.long }}
        onCloseClick={() => setSelected(null)}
    >
        {props.address ?
            <MapInfoWindow point={selected} address={props.address} baseURL={props.baseURL} /> :
            <div className="loader" style={{ width: 15, height: 15 }}></div>}
    </InfoWindow>;
}