import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer
} from "@react-google-maps/api";
import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';

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

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    //Markers
    const MarkerData = (data, clusterer) => {
        if (data !== undefined) {
            return (
                data.map((mapVuzix, index) =>
                    <Marker
                        onMouseOver={hoverMarker(setSelected, mapVuzix, props)}
                        onMouseOut={() => setSelected(null)}
                        key={index}
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

    const logBounds = () => props.loadDetailedDivData(props.markersMap.vuzixMap.filter(m => mapR.getBounds().contains(new window.google.maps.LatLng(m.lat, m.long))), false);

    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 19, gridSize: 60, ignoreHidden: true };
    return (

        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            clickableIcons={false}
            options={mapOptions}
            onLoad={onLoad}
            onIdle={() => logBounds()}
            onDragEnd={() => {
                props.changeCenter(mapR);
                props.activateLoader(true);
            }}
            onZoomChanged={() => {
                if (mapR) {
                    if (mapR.getZoom() < 21) {
                        props.activateLoader(true);
                    }
                }
            }}
        >
            <MarkerClusterer options={clusterOptions}>
                {clusterer => MarkerData(props.detailDivData, clusterer)}
            </MarkerClusterer>
            {selected ? customInfoWindow(selected, mapR, setSelected, props) : null}
        </GoogleMap>
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
        props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long, 3);
        setSelected(mapVuzix);
    };
}

function customInfoWindow(selected, mapR, setSelected, props) {

    return <InfoWindow
        position={{ lat: props.center.lat, lng: props.center.lng }}
        onCloseClick={() => setSelected(null)}
        onMouseOut={() => setSelected(null)}
    // options={{ disableAutoPan: true }}
    >
        <MapInfoWindow point={selected} address={props.address} baseURL={props.baseURL} />
    </InfoWindow>;
}