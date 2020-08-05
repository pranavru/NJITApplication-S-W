import React from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";

import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';

import "../MapComponent/MapComponent.css"

import { connect } from 'react-redux';
import { updateMapAddressOnExpiry, loadMarkers, infoWindowMarker, changeMapCenter, loadMap } from '../../redux/ActionCreators'

const mapStateToProps = (state) => { return { DataVuzix: state.dataVuzix, MapMarkersData: state.mapMarkersData, Addresses: state.addresses, InfoWindow: state.infoWindow } }

const mapDispatchToProps = (dispatch) => ({
    loadMap: (data, refObj) => dispatch(loadMap(data, refObj)),
    changeMapCenter: (data) => dispatch(changeMapCenter(data)),
    loadMarkers: (data, mapObj, mapReference, type) => dispatch(loadMarkers(data, mapObj, mapReference, type)),
    infoWindowMarker: (data) => dispatch(infoWindowMarker(data)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry()),
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
                            hoverMarker(mapVuzix, props);
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
    return mapVuzix.speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
        mapVuzix.speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
            !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerN.svg" :
                (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : "/markerN.svg";
}

const hoverMarker = (mapVuzix, props) => {
    if (mapVuzix) {
        mapVuzix.address = props.Addresses.addresses.address.get(`${mapVuzix.lat.toFixed(3)}:${mapVuzix.long.toFixed(3)}`);
        mapVuzix.animated = false;
        mapVuzix.video = [
            {
                src: '/Unknown.jpg',
                thumbnail: '/Unknown.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
                tags: [{ value: "Mountains", title: "Mountains" }, { value: "Knights", title: "Knights" }],
            }, {
                src: '/Unknown1.jpg',
                thumbnail: '/Unknown1.jpg',
                thumbnailWidth: 320,
                thumbnailHeight: 212,
            }, {
                src: '/Unknown2.jpg',
                thumbnail: '/Unknown2.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
                tags: [{ value: "Sunset", title: "Sunset" }, { value: "Lake", title: "Lake" }],
            }, {
                src: '/Unknown3.jpg',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 212,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
                tags: [{ value: "Sunrise", title: "Sunrise" }, { value: "Sunrise", title: "Sunrise" }],
            }, {
                src: '/Unknown3.png',
                thumbnail: '/Unknown1.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown2.jpg',
                thumbnail: '/Unknown2.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown3.jpg',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown3.png',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 120,
                thumbnailHeight: 86,
            }, {
                src: '/Unknown3.jpg',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown3.jpg',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 260,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 60,
                thumbnailHeight: 20,
            }, {
                src: '/Unknown3.jpg',
                thumbnail: '/Unknown3.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }, {
                src: '/Unknown4.jpg',
                thumbnail: '/Unknown4.jpg',
                thumbnailWidth: 160,
                thumbnailHeight: 106,
            }]
        // 'http://18.191.247.248/media/videos/videoNew.mp4';
    }
    props.infoWindowMarker(mapVuzix);
}

const customInfoWindow = (props, center) => {
    let sw = props.MapMarkersData.mapMarkersData.mapObject.getBounds().getSouthWest(), lat = (center.lat + sw.lat()) / 2;
    return <InfoWindow
        position={{ lat: lat, lng: center.lng }}
        onCloseClick={() => {
            props.DataVuzix.dataVuzix.vuzixMap.filter(m => { if (m.keepAlive) { m.keepAlive = false } })
            props.infoWindowMarker(null)
        }}
        onMouseOut={() => props.infoWindowMarker(null)}
        options={{ disableAutoPan: true }}
    >
        <MapInfoWindow point={props.InfoWindow.infoWindow} />
    </InfoWindow >;
}