import React from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";

import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';

import "../MapComponent/MapComponent.css"
import { baseUrl } from "../../shared/baseUrl";

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

const iconImage = (mapVuzix) => {
    const s = mapVuzix.all_speech.length;
    const p = mapVuzix.person_names.lenght;
    return s > 0 && p <= 0 ? "/markerSpeech.svg" : s <= 0 && p > 0 ? "/markerPerson.svg" :
        !(s > 0 && p > 0) ? "/markerN.svg" : (s > 0 && p > 0) ? "/markerSP.svg" : "/markerN.svg";
}

const hoverMarker = (mark, props) => {
    const data = props.DataVuzix.dataVuzix;
    const addr = props.Addresses.addresses.address;
    if (mark) {
        mark.address = addr.get(`${mark.lat.toFixed(3)}:${mark.long.toFixed(3)}`);
        mark.animated = false;
        if (data.gps_lists) {
            let keyValues = data.gps_lists.get(`${mark.lat},${mark.long}`)
            mark.videos = keyValues.filter(m => m.video)
            mark.images = keyValues.filter(m => m.image).map(m => {
                m.src = baseUrl + m.image; m.thumbnail = baseUrl + m.image; m.thumbnailWidth = 160; m.thumbnailHeight = 110;
                return m;
            });
        }
    }
    props.infoWindowMarker(mark);
}

const customInfoWindow = (props, center) => {
    const data = props.DataVuzix.dataVuzix;
    const markerData = props.MapMarkersData.mapMarkersData;
    const infoWindow = props.InfoWindow.infoWindow;

    let sw = markerData.mapObject.getBounds().getSouthWest(), lat = (center.lat + sw.lat()) / 2;
    return <InfoWindow
        position={{ lat: lat, lng: center.lng }}
        onCloseClick={() => {
            data.vuzixMap.filter(m => { if (m.keepAlive) { m.keepAlive = false } return null; })
            props.infoWindowMarker(null)
        }}
        options={{ disableAutoPan: true }}
    >
        <MapInfoWindow point={infoWindow} v={props.videoPlayer} />
    </InfoWindow >;
}

const MapComponent = (props) => {
    const data = props.DataVuzix.dataVuzix;
    const markerData = props.MapMarkersData.mapMarkersData;
    const infoWindow = props.InfoWindow.infoWindow;

    const { center, detail, mapMarkers, mapObject } = markerData;
    
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
    const MarkerData = (markData, clusterer) => {
        if (markData !== undefined) {
            return (
                markData.map((mapVuzix, index) =>
                    <Marker
                        onMouseOver={() => {
                            data.vuzixMap.filter(m => m.keepAlive = m.keepAlive ? false : null)
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
            return (<></>);
    }

    const logBounds = () => {
        props.loadMarkers(data.vuzixMap, markerData);
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
                props.changeMapCenter(markerData)
            }}
            onZoomChanged={() => {
                props.changeMapCenter(markerData)
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
            {infoWindow ? customInfoWindow(props, center) : null}
        </GoogleMap >
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);