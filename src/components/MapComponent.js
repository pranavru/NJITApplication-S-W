import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import MapInfoWindow from './MapInfoWindow';
function MapComponent(props) {

    const mapContainerStyle = { height: "100vh", width: props.details ? "47.5vw" : "70vw", left: props.details ? "52.5vw" : "30vw" };
    const options = { disableDefaultUI: true, zoomControl: true };
    const center = props.center;
    const GOOGLE_API_KEY = 'AIzaSyABBr3dtnI6vkHnyzMjztupIDjhxNXCmng';

    //Data Loading
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_API_KEY });
    const [selected, setSelected] = React.useState(null);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => { mapRef.current = map; }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    //Markers
    const MarkerData = (data) => {
        if (data !== undefined) {

            return (
                data.map(mapVuzix =>

                    <Marker
                        onMouseOver={() => {
                            setSelected(mapVuzix);
                            props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long, 0)
                        }}
                        onMouseOut={() => setSelected(null)}
                        key={mapVuzix.id}
                        animation={mapVuzix.visible ? window.google.maps.Animation.BOUNCE : null}

                        position={{ lat: mapVuzix.lat, lng: mapVuzix.long }}
                        icon={{
                            url:
                                mapVuzix.speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
                                    mapVuzix.speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
                                        !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerN.svg" :
                                            (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : "/markerN.svg",
                            scaledSize: new window.google.maps.Size(20, 45)
                        }}
                    />
                )
            );
        }
        else
            return (<div></div>);
    }

    return (
        <div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={19}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {MarkerData(props.markersMap.vuzixMap)}
                {selected ? (
                    <InfoWindow
                        position={{ lat: selected.lat, lng: selected.long }}
                        onCloseClick={() => {
                            setSelected(null);
                        }}
                    >
                        {props.address !== "" ?
                            <MapInfoWindow point={selected} address={props.address} baseURL={props.baseURL} /> :
                            <div className="loader"></div>
                        }
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}

export default MapComponent;