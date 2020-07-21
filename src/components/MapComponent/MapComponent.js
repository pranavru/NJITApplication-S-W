import React from "react";
import { Button, CardText } from 'reactstrap';
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';
import "../MapComponent/MapComponent.css"

const MapComponent = (props) => {
    const { center, detail, mapMarkers, mapObject } = props.mapDetailsData;
    const mapContainerStyle = { height: window.innerHeight, width: detail ? "55vw" : "77.5vw", left: detail ? "45vw" : "22.5vw" };
    const mapOptions = { disableDefaultUI: true, zoomControl: true };
    const GOOGLE_API_KEY = 'AIzaSyABBr3dtnI6vkHnyzMjztupIDjhxNXCmng';

    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const onLoad = React.useCallback(function callback(map1) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map1.fitBounds(bounds);
        props.loadMarkers(props.DataVuzix, map1, props.mapDetailsData, "mapReference");
    }, [center, props])

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    //Markers
    const MarkerData = (data, clusterer) => {
        if (data !== undefined) {
            return (
                data.map((mapVuzix, index) =>
                    <Marker
                        onMouseOver={() => hoverMarker(mapVuzix, props)}
                        onMouseOut={() => hoverMarker(null, props)}
                        key={index}
                        animation={mapVuzix.animated ? window.google.maps.Animation.BOUNCE : null}
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
        const bounds = mapObject.getBounds()
        const markers = props.DataVuzix.filter(m => bounds.contains(new window.google.maps.LatLng(m.lat, m.long)))
        props.loadMarkers(markers, null, props.mapDetailsData, "markers");
        props.activateLoader(false);
    }

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
                props.activateLoader(true);
                props.changeMapCenter(props.mapDetailsData)
            }}
            onZoomChanged={() => {
                if (mapObject) {
                    const zoomLevel = mapObject.getZoom();
                    if (zoomLevel < 21 && zoomLevel % 2 === 0) {
                        props.activateLoader(true);
                    }
                }
            }}
        >
            <MarkerClusterer options={clusterOptions}>
                {clusterer => MarkerData(mapMarkers, clusterer)}
            </MarkerClusterer>
            {props.infoWindow.infoWindow ? customInfoWindow(props, center) : null}
            {!mapMarkers.length && <Button
                value="Pan to Closest Marker"
                color="info"
                onClick={() => props.findClosestMarker(props.DataVuzix, props.mapDetailsData)}
                className="panToMarkerButton"
            >
                <CardText>Pan to Closest Marker</CardText>
            </Button>}
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

function hoverMarker(mapVuzix, props) {
    if (mapVuzix) { mapVuzix.address = props.address.get(`${mapVuzix.lat.toFixed(3)}:${mapVuzix.long.toFixed(3)}`); }
    props.infoWindowMarker(mapVuzix);
}

function customInfoWindow(props, center) {
    let sw = props.mapDetailsData.mapObject.getBounds().getSouthWest(), lat = (center.lat + sw.lat()) / 2;
    return <InfoWindow
        position={{ lat: lat, lng: center.lng }}
        onCloseClick={() => props.infoWindowMarker(null)}
        onMouseOut={() => props.infoWindowMarker(null)}
    >
        <MapInfoWindow point={props.infoWindow.infoWindow} baseURL={props.baseURL} />
    </InfoWindow >;
}