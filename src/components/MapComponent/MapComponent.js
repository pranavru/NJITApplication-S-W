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

const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = dateTimeFormat.formatToParts(new Date(p))

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}

const iconImage = (mapVuzix) => {
    const s = mapVuzix.all_speech.length;
    const p = mapVuzix.person_names.length;
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
            let keyValues = data.gps_lists.get(`${mark.lat},${mark.long}`).map(m => data.vuzixMap.filter(v => v.id === m.id)[0])
            mark.videos = keyValues.filter(m => m.video).map(m => {
                return { video: m.video, thumbnail: m.thumbnail, created: dateStringVal(m.created) };
            })
            mark.images = keyValues.filter(m => m.image).map(m => {
                return { src: baseUrl + m.image, thumbnail: baseUrl + m.image, thumbnailWidth: 160, thumbnailHeight: 110, tags: [{ value: dateStringVal(m.created), title: dateStringVal(m.created) }], caption: "" }
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
            data.vuzixMap.filter(m => m.keepAlive).map(m => m.keepAlive = false);
            props.infoWindowMarker(null);
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
    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 19, gridSize: 60, ignoreHidden: true };

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
                            hoverMarker(mapVuzix, props)
                            data.vuzixMap.filter(m => m.keepAlive).map(m => m.keepAlive = false)

                            window.setTimeout(() => {
                                if (!mapVuzix.keepAlive) {
                                    hoverMarker(null, props)
                                }
                            }, 2000)
                        }}
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
                        zIndex={mapVuzix.zIndex}
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
            onMouseMove={() => {

            }}
        >
            {infoWindow ? customInfoWindow(props, center) : null}
            <MarkerClusterer options={clusterOptions}>
                {clusterer => MarkerData(mapMarkers, clusterer)}
            </MarkerClusterer>
        </GoogleMap >
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);