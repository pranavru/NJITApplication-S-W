import React from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";

import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';

import "../MapComponent/MapComponent.css"

import { connect } from 'react-redux';
import { updateMapAddressOnExpiry, loadMarkers, infoWindowMarker, changeMapCenter, loadMap, videoPlayer } from '../../redux/ActionCreators'

const mapStateToProps = (state) => { return { DataVuzix: state.dataVuzix, MapMarkersData: state.mapMarkersData, Addresses: state.addresses, InfoWindow: state.infoWindow } }

const mapDispatchToProps = (dispatch) => ({
    loadMap: (data, refObj) => dispatch(loadMap(data, refObj)),
    changeMapCenter: (data) => dispatch(changeMapCenter(data)),
    loadMarkers: (data, mapObj, mapReference, type) => dispatch(loadMarkers(data, mapObj, mapReference, type)),
    infoWindowMarker: (data) => dispatch(infoWindowMarker(data)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry()),
    videoPlayer: data => dispatch(videoPlayer(data))
})

const MapComponent = (props) => {
    const { center, detail, mapMarkers, mapObject } = props.MapMarkersData.mapMarkersData;
    const mapContainerStyle = { height: window.innerHeight, width: detail ? "55vw" : "77.5vw", left: detail ? "45vw" : "22.5vw" };
    const mapOptions = { disableDefaultUI: true, zoomControl: true };
    const GOOGLE_API_KEY = 'AIzaSyAFHPjPBHcDOhJIn3HP6pbqVLZhCrORnbs';

    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const onLoad = React.useCallback(function callback(map1) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map1.fitBounds(bounds);
        props.loadMap(map1, props.MapMarkersData.mapMarkersData);
    }, [center, props])

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    //Markers
    const MarkerData = (data, clusterer) => {
        if (data !== undefined) {
            return (
                data.map((mapVuzix, index) =>
                    <Marker
                        onMouseOver={() => {
                            props.DataVuzix.dataVuzix.vuzixMap.filter(m => m.keepAlive = m.keepAlive ? false : null)
                            window.setTimeout(hoverMarker(mapVuzix, props), 5000);
                        }}
                        onMouseOut={() => !mapVuzix.keepAlive ? hoverMarker(null, props) : null}
                        onClick={() => {
                            mapVuzix.keepAlive = true;
                            if (mapVuzix.images || mapVuzix.videos) {
                                hoverMarker(mapVuzix, props);
                            }
                        }}
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
        props.loadMarkers(props.DataVuzix.dataVuzix.vuzixMap, props.MapMarkersData.mapMarkersData);
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
                props.changeMapCenter(props.MapMarkersData.mapMarkersData)
            }}
            onZoomChanged={() => {
                props.changeMapCenter(props.MapMarkersData.mapMarkersData)
                if (mapObject) {
                    const zoomLevel = mapObject.getZoom();
                    if (zoomLevel < 20) {
                        props.activateLoader(true);
                    }
                }
            }}
            onResize={() => props.activateLoader(true)}
        >
            <MarkerClusterer options={clusterOptions}>
                {clusterer => MarkerData(mapMarkers, clusterer)}
            </MarkerClusterer>
            {props.InfoWindow.infoWindow ? customInfoWindow(props, center) : null}
        </GoogleMap >
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);

const iconImage = (mapVuzix) => {
    return mapVuzix.all_speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
        mapVuzix.all_speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
            !(mapVuzix.all_speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerN.svg" :
                (mapVuzix.all_speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : "/markerN.svg";
}

const hoverMarker = (mapVuzix, props) => {
    if (mapVuzix) {
        mapVuzix.address = props.Addresses.addresses.address.get(`${mapVuzix.lat.toFixed(3)}:${mapVuzix.long.toFixed(3)}`);
        mapVuzix.animated = false;
    }
    props.infoWindowMarker(mapVuzix);
}

const customInfoWindow = (props, center) => {
    let sw = props.MapMarkersData.mapMarkersData.mapObject.getBounds().getSouthWest(), lat = (center.lat + sw.lat()) / 2;
    return <InfoWindow
        position={{ lat: lat, lng: center.lng }}
        onCloseClick={() => {
            props.DataVuzix.dataVuzix.vuzixMap.filter(m => { if (m.keepAlive) { m.keepAlive = false } return null; })
            props.infoWindowMarker(null)
        }}
        onMouseOut={() => props.infoWindowMarker(null)}
        options={{ disableAutoPan: true }}
    >
        <MapInfoWindow point={props.InfoWindow.infoWindow} v={props.videoPlayer} />
    </InfoWindow >;
}