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
    const mapContainerStyle = { height: "100vh", width: "70vw", left: "30vw" };
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

    //Markers
    const MarkerData = (data) => {
        if (data !== undefined) {

            return (
                data.map(mapVuzix =>

                    <Marker
                        onMouseOver={() => { setSelected(mapVuzix) }}
                        onMouseOut={() => setSelected(null)}
                        key={mapVuzix.id}
                        position={{ lat: mapVuzix.lat, lng: mapVuzix.long }}
                        onClick={() => {
                            setSelected(mapVuzix)
                            console.log(mapVuzix)
                        }}
                    // icon={{
                    //     url:
                    //         mapVuzix.speech.length > 0 ? '/forum-black-24dp green.svg' :
                    //             mapVuzix.person_names.length > 0 ? '/supervised_user_circle-black-24dp.svg' :
                    //                 !(mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? null :
                    //                     (mapVuzix.speech.length > 0 && mapVuzix.person_names.length > 0) ? '/supervised_user_circle.svg' : null,
                    //     scaledSize: new window.google.maps.Size(40, 40)
                    // }}
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
                        <MapInfoWindow point={selected} />
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}

export default MapComponent;