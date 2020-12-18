import React, { Fragment, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import { Input, InputGroup, CardText } from 'reactstrap';
import { FormGroup } from "@material-ui/core";

import MapInfoWindow from '../MapInfoWindow/MapInfoWindow';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import "../MapComponent/MapComponent.css"

import { connect } from 'react-redux';
import { updateMapAddressOnExpiry, loadMarkers, infoWindowMarker, changeMapCenter, loadMap, videoPlayer, setMarkersAsMapMoves, editDataVuzix } from '../../redux/ActionCreators'

const mapStateToProps = (state) => { return { DataVuzix: state.dataVuzix, MapMarkersData: state.mapMarkersData, Addresses: state.addresses, InfoWindow: state.infoWindow } }

const mapDispatchToProps = (dispatch) => ({
    loadMap: (data, refObj) => dispatch(loadMap(data, refObj)),
    changeMapCenter: (data) => dispatch(changeMapCenter(data)),
    loadMarkers: (data, mapReference) => dispatch(loadMarkers(data, mapReference)),
    infoWindowMarker: (data) => dispatch(infoWindowMarker(data)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry()),
    videoPlayer: (data) => dispatch(videoPlayer(data)),
    setMarkersAsMapMoves: (data) => dispatch(setMarkersAsMapMoves(data)),
    editDataVuzix: (obj, props) => dispatch(editDataVuzix(obj, props)),
})

/**
 * @param  {String} p
 */
const dateStringVal = (p) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(new Date(p))
    return `${month} ${day}, ${year} ${hour}:${minute}`;
}

/**
 * @param  {} mapVuzix
 */
const iconImage = (mapVuzix) => {
    const s = mapVuzix.all_speech.length;
    const p = mapVuzix.person_names.length;
    const { REACT_APP_MARKER_URL_SPEECH, REACT_APP_MARKER_URL_PERSON, REACT_APP_MARKER_URL_NONE, REACT_APP_MARKER_URL_SPEECH_PERSON } = process.env;

    return s > 0 && p <= 0 ? REACT_APP_MARKER_URL_SPEECH : s <= 0 && p > 0 ? REACT_APP_MARKER_URL_PERSON :
        !(s > 0 && p > 0) ? REACT_APP_MARKER_URL_NONE : (s > 0 && p > 0) ? REACT_APP_MARKER_URL_SPEECH_PERSON : REACT_APP_MARKER_URL_NONE;
}

/**
 * @param  {} mark
 * @param  {} props
 */
const hoverMarker = (mark, props) => {
    
    /**
     * @type ArrayOfEvents
     */
    const data = props.DataVuzix.dataVuzix;
    
    /**
     * @type initialDataLoadInterface.gps_lists
     */
    const addr = props.Addresses.addresses.address;
    
    if (mark) {
        mark.address = addr.get(`${mark.lat.toFixed(3)}:${mark.long.toFixed(3)}`);
        if (!mark.address) { mark.address = "Location Unavailable" }
        mark.animated = false;
        if (data.gps_lists) {
            let keyValues = data.gps_lists.has(`${mark.lat},${mark.long}`) ? data.gps_lists.get(`${mark.lat},${mark.long}`).map(m => data.vuzixMap.filter(v => v.id === m.id)[0]) : [];
            mark.videos = keyValues.filter(m => m.video).map(m => {
                let createdDate = dateStringVal(m.created);
                let i = { video: m.video, thumbnail: m.thumbnail, tags: [{ value: createdDate, title: createdDate }], caption: m.all_speech };
                personTags(m, i);
                return i;
            })
            mark.images = keyValues.filter(m => m.image).map(m => {
                let i = { src: process.env.REACT_APP_BASE_URL + m.image, thumbnail: process.env.REACT_APP_BASE_URL + m.image, thumbnailWidth: 160, thumbnailHeight: 110, tags: [{ value: dateStringVal(m.created), title: dateStringVal(m.created) }], caption: m.all_speech[0].speech, customOverlay };
                personTags(m, i);
                if (m.all_speech[0].speech || i.tags.length > 1) { i.customOverlay = customOverlay(m, i) }
                return i;
            });
        }
    }
    props.infoWindowMarker(mark);
}
/**
 * @param  {} m
 * @param  {} i
 */
function personTags(m, i) {
    if (m.person_names.length > 0) {
        m.person_names.map(p => i.tags.push({ value: p.person_name.toUpperCase(), title: p.person_name.toUpperCase() }));
    }
}

/**
 * @param  {} m
 * @param  {} i
 */
const customOverlay = (m, i) => <div className="captionStyle">
    <div>{m.all_speech[0].speech}</div>
    {i.hasOwnProperty('tags') && setCustomTags(i)}
</div>;

/**
 * @param  {} i
 */
const setCustomTags = (i) => i.tags.map((t, index) => index !== 0 ? <div
    key={t.value}
    className="customTagStyle">
    {t.title}
</div> : <></>);

/**
 * @param  {} props
 * @param  {} center
 */
const customInfoWindow = (props, center) => {
    const data = props.DataVuzix.dataVuzix;
    const markerData = props.MapMarkersData.mapMarkersData;
    const infoWindow = props.InfoWindow.infoWindow;
    return <InfoWindow
        position={{ lat: infoWindow.lat, lng: infoWindow.long }}
        onCloseClick={() => {
            data.vuzixMap.filter(m => m.keepAlive).map(m => m.keepAlive = false);
            props.infoWindowMarker(null);
        }}
        options={{
            disableAutoPan: markerData.detail ? false : true,
            pixelOffset: calculateInfowWindowLatLng(markerData.mapObject, center, new window.google.maps.LatLng(infoWindow.lat, infoWindow.long))
        }}
    >
        <MapInfoWindow point={infoWindow} v={props.videoPlayer} updateInfoWindow={props.infoWindowMarker} />
    </InfoWindow >;
}

/**
 * @param  {} map
 * @param  {} center
 * @param  {} latLng
 */
const calculateInfowWindowLatLng = (map, center, latLng) => {
    latLng = getPixelFromLatLng(map, latLng);
    center = map.getProjection().fromLatLngToPoint(map.getCenter());
    const northEast = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast()), southWest = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    const topNearCenter = ((center.y + northEast.y) / 2) < latLng.y, bottomNearCenter = ((center.y + southWest.y) / 2) < latLng.y;
    let quadrant = "", offset = {};
    quadrant += (latLng.y > center.y) ? "b" : "t";
    quadrant += (latLng.x < center.x) ? "l" : "r";
    if (quadrant === "tr") {
        offset = new window.google.maps.Size(-230, !topNearCenter ? 430 : 340);
    } else if (quadrant === "tl") {
        offset = new window.google.maps.Size(230, !topNearCenter ? 430 : 340);
    } else if (quadrant === "br") {
        offset = new window.google.maps.Size(-230, bottomNearCenter ? -20 : 120);
    } else if (quadrant === "bl") {
        offset = new window.google.maps.Size(230, bottomNearCenter ? -20 : 120);
    }
    return offset;
}

/**
 * @param  {} mapObject
 * @param  {} latLng
 */
const getPixelFromLatLng = (mapObject, latLng) => {
    var projection = mapObject.getProjection();
    
    //refer to the google.maps.Projection object in the Maps API reference
    var point = projection.fromLatLngToPoint(latLng);
    return point;
}

const MapComponent = (props) => {
    const data = props.DataVuzix.dataVuzix;
    const markerData = props.MapMarkersData.mapMarkersData;
    const infoWindow = props.InfoWindow.infoWindow;

    const { center, detail, mapMarkers, mapObject } = markerData;
    const { REACT_APP_GOOGLE_MAP_API_KEY, REACT_APP_GOOGLE_MAP_CLUSTER_IMAGE_URL } = process.env;

    const mapContainerStyle = { height: window.innerHeight * 0.92, width: detail ? "55%" : "77.5%", left: detail ? "45%" : "22.5%" };
    const mapOptions = { disableDefaultUI: true, zoomControl: true };

    /**
     * Setting up the custom clusterer Component
     * @type Object 
     */
    const clusterOptions = { imagePath: REACT_APP_GOOGLE_MAP_CLUSTER_IMAGE_URL, maxZoom: 19, gridSize: 60, ignoreHidden: true };
    
    /**
     * This method loads the Map using the API Key, and returns the boolean value or an error message.
     * @param  {REACT_APP_GOOGLE_MAP_API_KEY}} {googleMapsApiKey
     */
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: REACT_APP_GOOGLE_MAP_API_KEY });

    /**
     * The functions sets the bounds when the mapObject is populated
     */
    const onLoad = useCallback(map1 => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map1.fitBounds(bounds);
        props.loadMap(map1, props.MapMarkersData.mapMarkersData);
    }, [center, props])

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    /**
     * @param  {ArrayOfEvents} markData
     * @param  {Object} clusterer
     */
    const MarkerData = (markData, clusterer) => {
        if (markData !== undefined) {
            return (
                markData.map((mapVuzix, index) =>
                    <Marker
                        onMouseOver={() => {
                            hoverMarker(mapVuzix, props)
                            data.vuzixMap.filter(m => m.keepAlive).map(m => m.keepAlive = false)
                        }}
                        onMouseOut={() => window.setTimeout(() => {
                            if (!mapVuzix.keepAlive) {
                                hoverMarker(null, props)
                            }
                        }, 1500)}
                        onClick={() => {
                            mapVuzix.keepAlive = true;
                            if (mapVuzix.images || mapVuzix.videos) {
                                hoverMarker(mapVuzix, props);
                            }
                        }}
                        key={index}

                        /**
                         * Sets the marker animation to Bounce when an onHover event is fired by Detail's Card Div.
                         */
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
    
    /**
     * The function loads the data based on the bounds of mapObject
     */
    const logBounds = () => {
        if (markerData.searchAsMapMoves || markerData.initialLoad) {
            props.loadMarkers(data.vuzixMap, markerData);
            if (markerData.initialLoad) { markerData.initialLoad = false; }
        }
        props.activateLoader(false);
    }
    
    /**
     * It loads a markup, if the mapObjectReference.searchAsMapMoves is unchecked.
     */
    const SearchMapMarkersAsMapMoves = () => <FormGroup>
        <InputGroup>
            <Input addon type="checkbox" name="searchAsMapMoves" checked={markerData.searchAsMapMoves} aria-label="SearchAsMapMoves" onClick={() => props.setMarkersAsMapMoves(markerData)} />
            <CardText className="searchAsMapMovesText">Search as Map moves</CardText>
        </InputGroup >
    </FormGroup >;
    
    /**
     * This function loads the data in the bounds irrespective of any filters applied and resets the filter.
     */
    const redoSearch = () => {
        const bounds = markerData.mapObject.getBounds();
        const n = bounds.getNorthEast(), s = bounds.getSouthWest();
        const location = [n.lat(), n.lng(), s.lat(), s.lng()];
        props.activateLoader(true);
        props.editDataVuzix({ location }, props)
    }

    /**
     * It loads the markup loading a button to search data within the bounds.
     */
    const RedoSearchComponent = () => <ButtonComponent name={"Redo Search in Map"} class="redoSearchDiv"
        callBackFunc={() => redoSearch()}
    />

    return (
        <Fragment>
            {!markerData.searchEventsOnCurrentLocation ? <div className="searchAsMapMovesDiv">
                <SearchMapMarkersAsMapMoves />
            </div> : <RedoSearchComponent />}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                clickableIcons={false}
                options={mapOptions}
                onLoad={onLoad}
                onIdle={() => logBounds()}
                onDragEnd={() => {
                    props.activateLoader(true);
                    if (!markerData.searchAsMapMoves && !markerData.initialLoad) {
                        markerData.searchEventsOnCurrentLocation = true;
                    }
                    props.changeMapCenter(markerData)
                }}
                onZoomChanged={() => {
                    if (!markerData.searchAsMapMoves && !markerData.initialLoad) {
                        markerData.searchEventsOnCurrentLocation = true;
                    }
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
                {infoWindow ? customInfoWindow(props, center) : null}
                <MarkerClusterer options={clusterOptions}>
                    {clusterer => MarkerData(mapMarkers, clusterer)}
                </MarkerClusterer>
            </GoogleMap >
        </Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);