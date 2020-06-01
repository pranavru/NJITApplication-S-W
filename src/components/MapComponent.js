import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import MapInfoWindow from './MapInfoWindow';


function MapComponent(props) {

    //Initialization
    const libraries = ["places"];
    const mapContainerStyle = { height: "100vh", width: props.details ? "47.5vw" : "70vw", left: props.details ? "52.5vw" : "30vw" };
    const options = { disableDefaultUI: true, zoomControl: true };
    const center = { lat: 40.74918, lng: -74.156204, };

    //Data Loading
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: "AIzaSyABBr3dtnI6vkHnyzMjztupIDjhxNXCmng", libraries });
    const [selected, setSelected] = React.useState(null);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    // const ReverseGeoCodeAPI = (lat, long) => {
    //     fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
    //         .then(res => res.json())
    //         .then(data => console.log(data.results[0].formatted_address))
    //         .catch(err => console.log(err))
    // }

    //Markers
    const MarkerData = (data) => {
        if (data !== undefined) {

            return (
                data.map(mapVuzix =>

                    <Marker
                        onMouseOver={() => {
                            setSelected(mapVuzix)
                            props.ReverseGeoCodeAPI(mapVuzix.lat, mapVuzix.long)
                        }}
                        onMouseOut={() => setSelected(null)}
                        key={mapVuzix.id}
                        position={{ lat: mapVuzix.lat, lng: mapVuzix.long }}
                        onClick={() => {
                            setSelected(mapVuzix)
                            console.log(mapVuzix)
                        }}
                        icon={{
                            url:
                                mapVuzix.speech.length > 0 && mapVuzix.person_names.length <= 0 ? "/markerSpeech.svg" :
                                    mapVuzix.speech.length <= 0 && mapVuzix.person_names.length > 0 ? "/markerPerson.svg" :
                                        !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? null :
                                            (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? "/markerSP.svg" : null,
                            scaledSize: new window.google.maps.Size(20, 40)
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
                // onClick={onMapClick}
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
                            <MapInfoWindow point={selected} geoLocation={props.ReverseGeoCodeAPI} address= {props.address} /> :
                            <div></div>
                        }
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}

export default MapComponent;