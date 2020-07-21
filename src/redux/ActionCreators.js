import * as ActionTypes from './ActionTypes';
// import { baseUrl } from "../shared/baseUrl";

const baseUrl = "http://18.191.247.248";
export const dataVuzixLoading = () => ({ type: ActionTypes.DATAVUZIX_LOADING });
export const mapFilterLoading = () => ({ type: ActionTypes.MAPFILTER_LOADING });
export const addressValueLoading = () => ({ type: ActionTypes.ADDRESSVALUE_LOADING });
export const mapMarkersDataLoading = () => ({ type: ActionTypes.MAPMARKERSDATA_LOADING });
export const infoWindowLoading = () => ({ type: ActionTypes.INFOWINDOW_LOADING });

export const dataVuzixFailed = (errmess) => ({ type: ActionTypes.DATAVUZIX_FALIED, payload: errmess })
export const mapFilterFailed = (errmess) => ({ type: ActionTypes.MAPFILTER_FAILED, payload: errmess })
export const addressValueFailed = (errmess) => ({ type: ActionTypes.ADDRESSVALUE_FAILED, payload: errmess });
export const mapMarkersDataFailed = (errmess) => ({ type: ActionTypes.MAPMARKERSDATA_FAILED, payload: errmess });
export const infoWindowFailed = (errmess) => ({ type: ActionTypes.INFOWINDOW_FAILED, payload: errmess });

export const loadDataVuzix = (data) => ({ type: ActionTypes.ADD_DATAVUZIX, payload: data });
export const loadMapFilter = (data) => ({ type: ActionTypes.ADD_INIT_MAPFILTER, payload: data });
export const loadEditedFilter = (data) => ({ type: ActionTypes.EDIT_MAPFILTER, payload: data });
export const loadAddressValue = (data) => ({ type: ActionTypes.ADD_ADDRESSVALUE, payload: data });
export const loadMapMarkerData = (data) => ({ type: ActionTypes.ADD_MAPMARKERSDATA, payload: data });
export const loadInfoWindow = (data) => ({ type: ActionTypes.INIT_INFOWINDOW, payload: data });

export const fetchDataVuzix = (dispatch) => {
    dispatch(dataVuzixLoading(true));
    return fetch(baseUrl + '/info')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        }, error => {
            throw error;
        })
        .then(response => response.json())
        .then(response => dispatch(loadDataVuzix(response)))
        .catch(error => dispatch(dataVuzixFailed(error.message)));
};

export const fetchMapFilter = (data) => (dispatch) => {
    dispatch(mapFilterLoading(true));
    const { range, dateMap, personObject, addressValue } = initializeMapFilter(data);
    dispatch(addressValueLoading(true));
    dispatch(loadAddressValue(addressValue));
    dispatch(loadMapFilter({
        isSpeech: false,
        startDate: data.startDate,
        endDate: data.endDate,
        personNames: personObject,
        dateValues: [new Date(data.startDate), new Date(data.endDate)],
        mapDateRange: {
            updated: range,
            values: range,
            domain: range,
            data: dateMap
        }
    }));
};

export const editMapFilter = (type, newValue, filter) => (dispatch) => {
    console.log(type, newValue, filter)
    let newFilter = filter;
    if (type.includes("isSpeech")) {
        newFilter.isSpeech = newValue;
    }
    if (type.includes("personNames")) {
        newFilter.personNames = newValue;
    }
    if (type.includes("dateValues")) {
        newFilter.dateValues = newValue;
        let updated = newValue, domain = newValue, values = newValue;
        newFilter.mapDateRange = { updated, domain, values, data: newFilter.mapDateRange.data }
    }
    if (type.includes("mapDateRange")) {
        const type = newValue.type;
        if (type.includes("update")) {
            newFilter.mapDateRange.updated = newValue.value;
        } else if (type.includes("onChange")) {
            newFilter.mapDateRange.values = newValue.value;
        } else if (type.includes("domain")) {
            newFilter.mapDateRange.domain = newValue.value;
        } else if (type.includes("barGraphData")) {
            newFilter.mapDateRange.data = newValue.value;
        } else {
            dispatch(loadEditedFilter(newFilter));
        };
    };
    dispatch(loadEditedFilter(newFilter));
};

// export const editMapFilter = (filter) => (dispatch) => {
//     dispatch(loadMapFilter(filter));
// };

export const initMapDetails = () => (dispatch) => {
    let mapReference = {
        center: { lat: 40.74918, lng: -74.156204 },
        detail: false,
        mapMarkers: [],
        animatedMarkerID: {},
        mapObject: null
    }
    dispatch(loadMapMarkerData(mapReference));
}

export const updateMapAddressOnExpiry = (data) => (dispatch) => {
    let address = new Map(), addressValue;
    dispatch(addressValueLoading(true));
    data.forEach(m => {
        let temp = loadMarkerAddresses(m, address)              //Load Address Values
        if (temp !== undefined) {
            addressValue = temp;
        }
    });
    dispatch(loadAddressValue(addressValue));
}

export const loadMarkers = (data, mapObj, mapReference, type) => (dispatch) => {
    // dispatch(mapMarkersDataLoading(true));
    if (type.includes("mapReference")) {
        mapReference.mapObject = mapObj;
    }
    if (type.includes("markers")) {
        mapReference.mapMarkers = data;
    }
    if (type.includes("displayDetails")) {
        mapReference.detail = !mapReference.detail;
    }
    dispatch(loadMapMarkerData(mapReference));
}

//Toggle Animation of map markers
export const animateMapMarker = (data, marker) => (dispatch) => {
    let newMarker = {}
    if (marker === null) {
        newMarker = data.mapMarkers.filter((d) => { if (d.animated === true) { d.animated = false; } })
    } else {
        newMarker = data.mapMarkers.filter((d) => { if (d.id === marker.id) { d.animated = true } })
    }
    dispatch(loadMapMarkerData(newMarker));
}

export const changeMapCenter = (data) => (dispatch) => {
    data.center = { lat: data.mapObject.getCenter().lat(), lng: data.mapObject.getCenter().lng() };
    dispatch(loadMapMarkerData(data));
}

export const findClosestMarker = (data, mapObject) => (dispatch) => {
    let latLng = mapObject.center;
    let R = 6371; // radius of earth in km
    let distances = [];
    let closest = -1;
    for (let i = 0; i < data.length; i++) {
        let mlatLng = { lat: data[i].lat, lng: data[i].long };
        let dLat = rad(mlatLng.lat - latLng.lat);
        let dLong = rad(mlatLng.lng - latLng.lng);
        let a = sinSquare(dLat / 2) + cosSquare(rad(latLng.lat)) * sinSquare(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        distances[i] = d;
        if (closest === -1 || d < distances[closest]) {
            closest = i;
        }
    }
    mapObject.center = { lat: data[closest].lat, lng: data[closest].long };
    dispatch(loadMapMarkerData(mapObject));
}

export const infoWindowMarker = (data) => (dispatch) => {
    if (data === undefined) {
        dispatch(infoWindowFailed("Data is not defined"));
    } else {
        dispatch(loadInfoWindow(data));
    }
}

// The method converts the Date isoStringValue to time in milliseconds.
const setDateValueinMilliSeconds = (dateValue) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(new Date(dateValue));
    return new Date(`${month} ${day}, ${year} ${hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0}:00:00`).getTime();
};

// This method calculates the range of slider and names of people in event
const initializeMapFilter = (data) => {
    let address = new Map(), addressValue;
    let range = [+setDateValueinMilliSeconds(data.startDate), +setDateValueinMilliSeconds(data.endDate)], dateMap = [], persons = new Map([]), personObject = [];
    data.vuzixMap.forEach(m => {
        m.animated = false;
        dateMap.push(setDateValueinMilliSeconds(m.created))     //Event Date in milliseconds
        personsArray(m, persons);                               //Load Persons Names
        let temp = loadMarkerAddresses(m, address)              //Load Address Values
        if (temp !== undefined) {
            addressValue = temp;
        }
    });
    Array.from(persons.keys()).forEach(element => personObject.push({ checked: false, name: element }))
    dateMap.sort();
    return { range, dateMap, personObject, addressValue };
};

const personsArray = (m, persons) => m.person_names.forEach(element => {
    if (!persons.has(element.person_name)) {
        persons.set(element.person_name);
    }
});

//Load addresses for Markers - Card Detail Div
const loadMarkerAddresses = (m, address) => {
    let expiryDate = new Date().getTime() + 300000;
    let key = `${m.lat.toFixed(3)}:${m.long.toFixed(3)}`;

    const fetchAndLoadMarkerAddresses = () => {
        Promise.all(
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${m.lat},${m.long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
                .then(res => res.json())
                .then(data => {
                    address.set(key, data.results[(parseInt(data.results.length / 2) + 1)].formatted_address);
                }).catch(err => console.log(err))
        ).then().catch(err => err);
    }

    if (!address.has(key)) {
        address.set(key, "");
        fetchAndLoadMarkerAddresses();
        return { address, expiryDate };
    }
};

// Pan to the Closest Marker if current Bounds contains zero markers
const rad = (x) => x * Math.PI / 180;
const sinSquare = (x) => Math.pow(Math.sin(x), 2);
const cosSquare = (x) => Math.pow(Math.cos(x), 2);