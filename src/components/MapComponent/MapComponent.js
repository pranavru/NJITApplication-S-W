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
    // const [currentZoom, setCurrentZoom] = React.useState(10);
    const [mapMarkersData, setMapMarkerData] = React.useState([]);
    const [isActive, setActiveLoader] = React.useState(false);

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
                        style={{ width: 20, height: 40 }}
                        key={createKey(mapVuzix)}
                        animation={mapVuzix.visible ? window.google.maps.Animation.BOUNCE : null}
                        position={{ lat: mapVuzix.lat, lng: mapVuzix.long }}
                        icon={{
                            url:
                                mapVuzix.speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
                                    mapVuzix.speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
                                        !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerN.svg" :
                                            (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : "/markerN.svg"
                        }}
                        clusterer={clusterer}
                    />
                )
            );
        }
        else
            return (<div></div>);
    }

    const logBounds = () => {
        props.initialLoad(false);
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
        setActiveLoader(false);
    }

    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 19, gridSize: 60, ignoreHidden: true };
    return (
        <LoadingOverlay
            active={isActive}
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
                    setActiveLoader(true);
                    logBounds();
                }}
                onDragStart={() => setActiveLoader(true)}
                onZoomChanged={() => setActiveLoader(true)}
            >

                <MarkerClusterer options={clusterOptions}>
                    {clusterer => MarkerData(mapMarkersData, clusterer)}
                </MarkerClusterer>
                {selected ? (
                    customInfoWindow(selected, setSelected, props)
                ) : null}
            </GoogleMap>
        </LoadingOverlay >
    );
}

export default MapComponent;

function customInfoWindow(selected, setSelected, props) {
    return <InfoWindow
        position={{ lat: selected.lat, lng: selected.long }}
        onCloseClick={() => setSelected(null)}
        onMouseOut={() => setSelected(null)}
    >
        {props.address ?
            <MapInfoWindow point={selected} address={props.address} baseURL={props.baseURL} /> :
            <div className="loader" style={{ width: 15, height: 15 }}></div>}
    </InfoWindow>;
}

function hoverMarker(setSelected, mapVuzix, props) {
    return () => {
        setSelected(mapVuzix);
        props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long, 3);
    };
}
