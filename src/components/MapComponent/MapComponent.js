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

    //Data Loading
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const [selected, setSelected] = React.useState(null);
    const [currentZoom, setCurrentZoom] = React.useState(10);
    const [mapR, setMap] = React.useState(null);
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onLoad = React.useCallback(function callback(map1) {
        const bounds = new window.google.maps.LatLngBounds();
        props.markersMap.vuzixMap.map(element => {
            bounds.extend({ lat: element.lat, lng: element.long })
        });
        map1.fitBounds(bounds);
        setMap(map1);
    }, [])

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    const createKey = (location) => {
        return location.lat + location.long
    };

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
        const bounds = mapR.getBounds();
        const NW = bounds.getNorthEast().toJSON();
        const SE = bounds.getSouthWest().toJSON();
        const marks = [];
        const zoomLevel = mapR.getZoom(); 
        const tradeOffValue = 3;
        const decimalValue = zoomLevel === 22 ? 3 : zoomLevel === 21 ? 2 : zoomLevel === 20 ? 1 : zoomLevel < 20 ? 0: 0;
        props.markersMap.vuzixMap.map(m => {
            if((NW.lat.toFixed(decimalValue) + tradeOffValue >= m.lat.toFixed(decimalValue)) || (NW.lat.toFixed(decimalValue) - tradeOffValue <= m.lat.toFixed(decimalValue))) {
                marks.push(m);
            }
        })

        props.loadDetailedDivData(marks.length <= 0 ? props.markersMap.vuzixMap : marks);
    }

    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 21, gridSize: 40, ignoreHidden: true };
    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={currentZoom}
                center={center}
                options={mapOptions}
                onLoad={onMapLoad}
                onZoomChanged={() => mapRef !== null ? mapRef.current !== undefined ? setCurrentZoom(mapRef.current.zoom) : null : null}
                onLoad={onLoad}
                onBoundsChanged={() => logBounds()}
            >
                <MarkerClusterer options={clusterOptions}>
                    {clusterer => MarkerData(props.markersMap.vuzixMap, clusterer)}
                </MarkerClusterer>
                {selected ? (
                    customInfoWindow(selected, setSelected, props)
                ) : null}
            </GoogleMap>
        </div>
    );
}

export default MapComponent;

function customInfoWindow(selected, setSelected, props) {
    return <InfoWindow
        position={{ lat: selected.lat, lng: selected.long }}
        onCloseClick={() => {
            setSelected(null);
        }}
    >
        {props.address !== "" ?
            <MapInfoWindow point={selected} address={props.address} baseURL={props.baseURL} /> :
            <div className="loader"></div>}
    </InfoWindow>;
}

function hoverMarker(setSelected, mapVuzix, props) {
    return () => {
        setSelected(mapVuzix);
        props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long, 0);
    };
}
