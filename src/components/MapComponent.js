import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer
} from "@react-google-maps/api";
import MapInfoWindow from './MapInfoWindow';

const MapComponent = (props) => {

    const mapContainerStyle = { height: window.innerHeight, width: props.details ? "47.5vw" : "70vw", left: props.details ? "52.5vw" : "30vw" };
    const mapOptions = { disableDefaultUI: true, zoomControl: true };
    const center = props.center;
    const GOOGLE_API_KEY = 'AIzaSyABBr3dtnI6vkHnyzMjztupIDjhxNXCmng';

    //Data Loading
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const [selected, setSelected] = React.useState(null);
    const [currentZoom, setCurrentZoom] = React.useState(2);
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => { mapRef.current = map; }, []);

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

    const clusterOptions = { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", maxZoom: 14 };
    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={currentZoom}
                center={center}
                options={mapOptions}
                onLoad={onMapLoad}
                onZoomChanged={() => mapRef !== null ? mapRef.current !== undefined ? setCurrentZoom(mapRef.current.zoom) : null : null}
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
        } }
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
