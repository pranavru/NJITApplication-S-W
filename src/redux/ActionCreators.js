import * as ActionTypes from './ActionTypes';
import axios from 'axios';
const { REACT_APP_BASE_URL,
    REACT_APP_GET_APP_DATA_API, REACT_APP_GET_APP_DATA_LOCATION_API, REACT_APP_QUERY_DATA_API, REACT_APP_QUERY_SPEECH_DATA_API,
    REACT_APP_TAGGED_PEOPLE_API, REACT_APP_UNTAGGED_PEOPLE_API, REACT_APP_USER_FEEDBACK_API,
    REACT_APP_GOOGLE_MAP_LOCATION_DETAILS_KEY, REACT_APP_GOOGLE_MAP_LOCATION_DETAILS_URL } = process.env;

/**
 * Change the isLoading attribute to true when data is updating
 * @param  {ActionTypes.type} type
 */
export const dataLoading = (type) => ({ type: type })

/**
 * Send an error response if there is an error in updating the payload
 * @param  {ActionTypes.type} type
 * @param  {String} message
 */
export const dataLoadingFailed = (type, message) => ({ type: type, payload: message })

//Update the store with the payload to store the data 
/**
 * @param  {ActionTypes.type} type
 * @param  {Object} data
 */
export const loadData = (type, data) => ({ type: type, payload: data })

/*
    *** Start of => Actions Performed in Data Loading Module
*/

// Fetches data when initial URL is hit.
export const fetchDataVuzix = (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.DATAVUZIX_LOADING));
    return fetch(REACT_APP_BASE_URL + REACT_APP_GET_APP_DATA_API)
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
        .then(response => {

            //Converting gps_lists Objects to a Map of {key, value} : key => `lat,long`, value => Array of ids
            response.gps_lists = new Map(Object.entries(response.gps_lists));
            response.vuzixMap.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
            dispatch(loadData(ActionTypes.type.ADD_DATAVUZIX, response))
        })
        .catch(error => dispatch(dataLoadingFailed(ActionTypes.type.DATAVUZIX_FALIED, error.message)));
};

// Edit Vuzix Blade data based on the Filter parameters as ```parameter```
export const editDataVuzix = (parameter, props) => (dispatch) => {
    const markerData = props.MapMarkersData.mapMarkersData
    let url = "";
    if (markerData.searchEventsOnCurrentLocation && parameter.hasOwnProperty("location")) {
        url = REACT_APP_BASE_URL + REACT_APP_GET_APP_DATA_LOCATION_API
    } else {
        url = REACT_APP_BASE_URL + REACT_APP_QUERY_DATA_API
    }
    return axios.post(url, parameter)
        .then(response => {
            if (!(response.data.vuzixMap.length > 0)) {
                alert("No data with search query");

                //If no data is returned, update Markers Array to []
                dispatch(loadMarkers([], props.MapMarkersData.mapMarkersData));
                props.activateLoader(false);
            } else {
                console.log(response.data);
                return response;
            }
        })
        .then(response => response.data)
        .then(response => {

            //Converting gps_lists Objects to a Map of {key, value} : key => `lat,long`, value => Array of ids
            response.gps_lists = new Map(Object.entries(response.gps_lists));
            response.vuzixMap.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())

            dispatch(loadData(ActionTypes.type.ADD_DATAVUZIX, response))
            dispatch(loadMarkers(props.DataVuzix.vuzixMap, markerData))

            //Change Map Center and set searchAsMapMoves to true
            markerData.initialLoad = true;
            markerData.searchEventsOnCurrentLocation = false;
            dispatch(changeMapCenter(markerData))

        }).then(() => props.activateLoader(false))
        .catch(err => dispatch(dataLoadingFailed(ActionTypes.type.DATAVUZIX_FALIED, err.message)))
}

/*
    *** End of => Actions Performed in Data Loading Module
-----------------------------------------------------------------------------------------------------------------------------------------------------------
    *** Start of => Actions Performed in Map Module
*/

// Fetches initial Map details when initial URL is hit
export const initMapDetails = () => (dispatch) => {

    let mapReference = {
        center: { lat: 40.74918, lng: -74.156204 },         // center: Harrision, Newark, NJ
        detail: false,
        mapMarkers: [],                                     // Markers to load on Map
        mapObject: null,                                     // Stores map details - bounds, terrain, etc.
        searchAsMapMoves: false,
        initialLoad: true,
        searchEventsOnCurrentLocation: false,
    }
    /**
     * Load Initial Map Details - set to Default Values
     * @param  {mapObjectReference} mapReference
     */
    dispatch(loadData(ActionTypes.type.INIT_MAP_DETAILS, mapReference));
}

/**
 * Load map details in mapObject on map Load
 * @param  {Object} mapObj
 * @param  {mapObjectReference} mapReference
 */
export const loadMap = (mapObj, mapReference) => dispatch => {
    dispatch(dataLoading(ActionTypes.type.MAPMARKERSDATA_LOADING));
    mapReference.mapObject = mapObj;
    dispatch(loadData(ActionTypes.type.LOAD_MAP, mapReference));
}

/**
 * Load markers available within the NorthWest and SouthEast bounds of the map window -- if mapObject !== undefined
 * @param  {markersEvents} data
 * @param  {mapObjectReference} mapReference
 * @param  {} =>(dispatch => {}
 */
export const loadMarkers = (data, mapReference) => (dispatch) => {
    const bounds = mapReference.mapObject.getBounds();
    if (data) {
        //Filter data based on Bounds values and return only those... available with in bounds
        if (mapReference.searchAsMapMoves || mapReference.initialLoad) {
            const markers = data.filter(m => bounds.contains(new window.google.maps.LatLng(m.lat, m.long)))
            mapReference.mapMarkers = markers;
        } else {
            mapReference.mapMarkers = data;
        }
        mapReference.zIndex = mapReference.zIndex === undefined ? mapReference.mapMarkers.length + 1 : mapReference.zIndex;
        dispatch(loadData(ActionTypes.type.ADD_MAPMARKERSDATA, mapReference));
    }
}

/**
 * Changes Map Center based on the mouse and keyboard Events - Drag / Zoom In / Zoom Out
 * @param  {mapObjectReference} data
 * @param  {} =>(dispatch => {}
 */
export const changeMapCenter = (data) => (dispatch) => {
    data.center = { lat: data.mapObject.getCenter().lat(), lng: data.mapObject.getCenter().lng() };
    dispatch(loadData(ActionTypes.type.CHANGE_MAP_CENTER, data));
}

/**
 * Calculates and loads the marker which is closest to the current center of the map.
 * @param  {markersEvents} data
 * @param  {mapObjectReference} mapObject
 * @param  {} =>(dispatch => {}
 */
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
    dispatch(loadData(ActionTypes.type.CLOSEST_MARKER, mapObject));
}

/**
 * Calculates and loads the most recent created marker to the current center of the map.
 * @param  {markersEvents} data
 * @param  {mapObjectReference} mapObject
 * @param  {} =>(dispatch => {}
 */
export const findRecentMarker = (data, mapObject) => (dispatch) => {
    let mostRecent = data ? data[0] : null;
    data.forEach(d => mostRecent = new Date(d.created).getTime() > new Date(mostRecent.created).getTime() ? d : mostRecent)
    mapObject.center = { lat: mostRecent.lat, lng: mostRecent.long };
    mapObject.mapMarkers.push(mostRecent);
    dispatch(loadData(ActionTypes.type.MOST_RECENT_MARKER, mapObject));
    dispatch(animateMapMarker(mapObject, mostRecent));
}
/**
 * Sets Loading markers when Map Moves
 * @param  {mapObjectReference} data
 * @param  {} =>(dispatch => {}
 */
export const setMarkersAsMapMoves = (data) => (dispatch) => {
    data.searchAsMapMoves = !data.searchAsMapMoves;
    dispatch(loadData(ActionTypes.type.SEARCH_AS_MAP_MOVES, data))
}

// Loads the Info window when mouse hovers over a marker
/**
 * @param  {markersEvents} data
 * @param  {} =>(dispatch => {}
 */
export const infoWindowMarker = (data) => (dispatch) => {
    if (data === undefined) {
        dispatch(dataLoadingFailed(ActionTypes.type.INFOWINDOW_FAILED, "Data is not defined"));
    } else {
        dispatch(loadData(ActionTypes.type.INIT_INFOWINDOW, data));
    }
}

// Pan to the Closest Marker if current Bounds contains zero markers
const rad = (x) => x * Math.PI / 180;
const sinSquare = (x) => Math.pow(Math.sin(x), 2);
const cosSquare = (x) => Math.pow(Math.cos(x), 2);

/**
 * @param  {mapObjectReference} data
 * @param  {} =>(dispatch => {}
 */
export const updateMapAddressOnExpiry = (data) => (dispatch) => {
    let address = new Map(), addressValue;
    dispatch(dataLoading(ActionTypes.type.ADDRESSVALUE_LOADING));
    data.forEach(m => {
        console.log(m)
        let temp = loadMarkerAddresses(m, address)              //Load Address Values
        if (temp !== undefined) {
            addressValue = temp;
        }
    });
    dispatch(loadData(ActionTypes.type.ADD_ADDRESSVALUE, addressValue));
}
/*
    *** End of => Actions Performed in Map Module
-----------------------------------------------------------------------------------------------------------------------------------------------------------
    *** Start of => Actions Performed in Details Card Module
*/

/**
 * Load Details Div 
 * @param  {Boolean} data
 * @param  {mapObjectReference} mapReference
 */
export const displayDetails = (data, mapReference) => dispatch => {
    mapReference.detail = data;
    dispatch(loadData(ActionTypes.type.DISPLAY_MARKER_DETAILS, mapReference));
}

/**
 * Toggle Animation of Details Div
 * @param  {mapObjectReference} data
 * @param  {markersEvents} marker
 * @param  {} =>(dispatch => {}
 */
export const animateMapMarker = (data, marker) => (dispatch) => {
    data.zIndex = data.zIndex + 1;
    if (marker === null) {
        data.mapMarkers.filter((d) => d.animated).map((m) => m.animated = false);
    } else {
        data.mapMarkers.filter((d) => d.id === marker.id).map(m => {
            m.animated = true;
            m.zIndex = data.zIndex;
            return m;
        });
    }
    dispatch(loadMarkers(data.mapMarkers, data));
}

/*
    *** End of => Actions Performed in Details Card Module
-----------------------------------------------------------------------------------------------------------------------------------------------------------
    *** Start of => Actions Performed in Filter Module
*/


/**
 * This method calculates the range of slider and names of people in event
 * @param {markersEvents} data.vuzixMap
 */
const initializeMapFilter = (data) => {
    let address = new Map(), addressValue, hours = 1000 * 60 * 30 * 2 * 3;
    let range = [+setDateValueinMilliSeconds(data.startDate) - (2 * hours), +setDateValueinMilliSeconds(data.endDate) + (2 * hours)], dateMap = [], persons = new Map([]), personObject = [];
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

// The method converts the Date isoStringValue to time in milliseconds.
const setDateValueinMilliSeconds = (dateValue) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(new Date(dateValue));
    return new Date(`${month} ${day}, ${year} ${hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0}:00:00`).getTime();
};

//Loads person names in the Filter list.
/**
 * @param  {markerEventDetails} m
 * @param  {String[]} persons
 */
const personsArray = (m, persons) => m.person_names.forEach(element => {
    if (!persons.has(element.person_name)) {
        persons.set(element.person_name);
    }
});

//Load addresses for Markers - Card Detail Div
/**
 * @param  {markerEventDetails} m
 * @param  {Map<String, String>} address
 */
const loadMarkerAddresses = (m, address) => {
    let expiryDate = new Date().getTime() + 300000;
    let key = `${m.lat.toFixed(3)}:${m.long.toFixed(3)}`;

    const fetchAndLoadMarkerAddresses = () => {
        Promise.all(
            fetch(`${REACT_APP_GOOGLE_MAP_LOCATION_DETAILS_URL}latlng=${m.lat},${m.long}&key=${REACT_APP_GOOGLE_MAP_LOCATION_DETAILS_KEY}`)
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

// Fetches filter data when initial URL is hit
export const fetchMapFilter = (data) => (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.MAPFILTER_LOADING));

    //Fetch Date Range, Date Values in milliseconds, People Names, Address Values for a GPS Co-ordinate.
    const { range, dateMap, personObject, addressValue } = initializeMapFilter(data);
    dispatch(dataLoading(ActionTypes.type.ADDRESSVALUE_LOADING));
    dispatch(loadData(ActionTypes.type.ADD_ADDRESSVALUE, addressValue));

    /**
     * @type mapFilterReference
     */
    const filter = {
        isSpeech: false,                                                    // Speech Attribute
        personNames: personObject,                                          // Person Names
        startDate: data.startDate,                                          // Start Date - To Limit User's Date Selection
        endDate: data.endDate,                                              // End Date - To Limit User's Date Selection
        dateValues: [new Date(data.startDate), new Date(data.endDate)],     // Date Range initialized
        mapDateRange: {                                                     // Date Range: Histogram Initialization
            updated: range,
            values: range,
            domain: range,
            data: dateMap
        },
        keyword: '',
    };
    dispatch(loadData(ActionTypes.type.ADD_INIT_MAPFILTER, filter));
};


/**
 * Edit Map Filter based on User Interaction
 * @param  {Object} type
 * @param  {parameterUpdatedValue} newValue
 * @param  {Object} props
 * @param  {} =>(dispatch => {}
 */
export const editMapFilter = (type, newValue, props) => (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.MAPFILTER_LOADING));
    dispatch(dataLoading(ActionTypes.type.VIDEODATA_LOADING));

    /**
     * @type mapFilterReference
     */
    let newFilter = props.mapFilter;
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
            dispatch(loadData(ActionTypes.type.EDIT_MAPFILTER, newFilter));
        };
    };
    if (type.includes("searchByText")) {
        newFilter.keyword = newValue.title;
    }
    dispatch(loadData(ActionTypes.type.EDIT_MAPFILTER, newFilter));
};

//Fetch Speech Text Values - Autocomplete API
export const fetchSpeechText = () => (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.SPEECHTEXT_LOADING));
    return fetch(REACT_APP_BASE_URL + REACT_APP_QUERY_DATA_API)
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
        .then(response => {
            dispatch(loadData(ActionTypes.type.ADD_SPEECHTEXT, response));
        })
        .catch(error => dataLoadingFailed(ActionTypes.type.VIDEODATA_FAILED, error.message));
}

// Fetch Data based on Speech Values
/**
 * @param  {String} speech
 * @param  {Object} props
 * @param  {} =>(dispatch
 * @param  {} =>axios.post(REACT_APP_BASE_URL+REACT_APP_QUERY_SPEECH_DATA_API
 * @param  {speech}} {keyword
 */
export const fetchDataUsingSpeechText = (speech, props) => (dispatch) => axios.post(REACT_APP_BASE_URL + REACT_APP_QUERY_SPEECH_DATA_API, { keyword: speech })
    .then(response => {
        if (!(response.data.vuzixMap.length > 0)) {
            alert("No data with search query");

            //If no data is returned, update Markers Array to []
            dispatch(loadMarkers([], props.MapMarkersData.mapMarkersData));
            props.activateLoader(false);
        } else {
            console.log(response.data);
            return response;
        }
    })
    .then(response => response.data)
    .then(response => {

        //Converting gps_lists Objects to a Map of {key, value} : key => `lat,long`, value => Array of ids
        response.gps_lists = new Map(Object.entries(response.gps_lists));

        dispatch(loadData(ActionTypes.type.ADD_DATAVUZIX, response))
        dispatch(loadMarkers(props.DataVuzix.vuzixMap, props.MapMarkersData.mapMarkersData))
        dispatch(changeMapCenter(props.MapMarkersData.mapMarkersData))

    }).then(() => props.activateLoader(false))
    .catch(err => dispatch(dataLoadingFailed(ActionTypes.type.DATAVUZIX_FALIED, err.message)))

/*
    *** End of => Actions Performed in Filter Module
-----------------------------------------------------------------------------------------------------------------------------------------------------------
    *** Start of => Actions Performed in Video Module
*/

// Loads the video in the Video Player when clicked from an Info window
export const videoPlayer = (url) => (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.VIDEODATA_LOADING));
    dispatch(loadData(ActionTypes.type.ADD_VIDEODATA, url));
};

// Edit Vuzix Blade data based on the Filter parameters as ```parameter```
export const editVideo = (parameter) => (dispatch) => {
    return axios.post(REACT_APP_BASE_URL + REACT_APP_QUERY_DATA_API, parameter)
        .then(response => {
            if (!response) {
                alert("No video found with search query");
            } else {
                console.log(response.data)
                let videoRef = { video: REACT_APP_BASE_URL + response.data.video, thumbnail: REACT_APP_BASE_URL + response.data.thumbnail }
                return videoRef;
            }
        })
        //Update videoDetails Object with the video Data.
        .then(r => dispatch(videoPlayer(r)))
        .catch(err => dispatch(dataLoadingFailed(ActionTypes.type.VIDEODATA_FAILED, err.message)))
}

/*
    *** End of => Actions Performed in Video Module
-----------------------------------------------------------------------------------------------------------------------------------------------------------
    *** Start of => Actions Performed in Feedback Module
*/

//Initialize person Information - feedback form
export const initializePersonAttr = () => async (dispatch) => {
    let attributes = {};
    await taggedPeople(attributes);
    return fetch(REACT_APP_BASE_URL + REACT_APP_UNTAGGED_PEOPLE_API)
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
        .then(response => {
            attributes.images = response.map(m => {
                return {
                    src: REACT_APP_BASE_URL + m.imageFile, thumbnail: REACT_APP_BASE_URL + m.imageFile,
                    thumbnailWidth: 100, thumbnailHeight: 100, id: m.id
                }
            })
            attributes.fname = ""; attributes.lname = ""; attributes.selectedImages = [];
            dispatch(loadData(ActionTypes.type.INIT_FEEDBACK, attributes));
        })
        .catch(error => dispatch(dataLoadingFailed(ActionTypes.type.FEEDBACK_FAILED, error.message)));
}

//Edit Person Attributes Form 
export const editPersonAttr = (data, props) => (dispatch) => {
    /**
     * @type feedbackInterface
     */
    let newFeed = props.feedback;
    switch (data.name) {
        case "fname":
            newFeed.fname = data.value;
            break;
        case "lname":
            newFeed.lname = data.value;
            break;
        case "images":
            newFeed.selectedImages = (data.value !== undefined) ? data.value : "";
            newFeed.images.map(i => {
                if (i.hasOwnProperty('isSelected')) {
                    i.isSelected = false;
                }
                return i;
            })
            break;
        case "gallery":
            let img = newFeed.images[data.value];
            console.log(newFeed, data.value);
            if (img) {
                if (img.hasOwnProperty("isSelected")) {
                    img.isSelected = !img.isSelected;
                    newFeed.selectedImages = img.src;
                }
                else {
                    img.isSelected = true;
                    newFeed.selectedImages = img.src;
                }
            }
            break;
        default:
            newFeed = props
            break;
    }
    dispatch(loadData(ActionTypes.type.ADD_FEEDBACK, newFeed));
};

//Loads person Information from the feedback form
/**
 * @param  {feedbackInterface} data
 * @param  {} =>(dispatch
 */
export const personAttributes = (data) => (dispatch) => {
    dispatch(dataLoading(ActionTypes.type.FEEDBACK_LOADING));
    if (data.selectedImages) {
        if ((data.fname && data.fname.length >= 3) && (data.lname && data.lname.length >= 3)) {
            let attributes;
            if (data.localFile) {
                attributes = new FormData();
                attributes.append("name", data.fname + ' ' + data.lname);
                attributes.append("file", data.selectedImages)
            } else {
                attributes = { name: data.fname + ' ' + data.lname, file: data.selectedImages, id: data.images.filter(m => m.isSelected).map(m => m.id) };
            }
            dispatch(loadData(ActionTypes.type.ADD_FEEDBACK, attributes));
            return axios.post(REACT_APP_BASE_URL + REACT_APP_USER_FEEDBACK_API, attributes, {
                headers: {
                    'Content-Type': data.localFile ? 'multipart/form-data' : 'application/json'
                }
            })
                .then(res => {
                    if (res.status === 200 || res.status === 206) {
                        alert("Response Submitted")
                    }
                })
                .catch((err) => alert(err));
        } else {
            dispatch(dataLoadingFailed(ActionTypes.type.FEEDBACK_FAILED, "Person name should be at least 3 letters"));
        }
    } else {
        dispatch(dataLoadingFailed(ActionTypes.type.FEEDBACK_FAILED, "No Images Found. Please enter an Image"));
    }
}

//Add Already Tagged People 
export const taggedPeople = (attributes) => fetch(REACT_APP_BASE_URL + REACT_APP_TAGGED_PEOPLE_API)
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
    .then(res => attributes.tags = res)
    .catch(error => console.log(error));

export const taggingCompleted = () => axios.post(REACT_APP_BASE_URL + REACT_APP_UNTAGGED_PEOPLE_API).then(response => {
    if (response.status === 200) {
        alert("Response Submitted")
    } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    }
}, error => {
    throw error;
}).catch(error => console.log(error));
/**
 * @param  {feedbackInterface} data
 */
export const deleteUntaggedImages = (data) => dispatch => {
    let updatedImages = data.images;
    let imageIDs = [];
    updatedImages.forEach((i, index) => {
        if (i.hasOwnProperty('isSelected') && i.isSelected === true) {
            imageIDs.push(i.id);
            data.images.splice(index, 1);
        }
    })
    return axios.post(REACT_APP_BASE_URL + REACT_APP_UNTAGGED_PEOPLE_API, { delete: imageIDs }).then(response => {
        if (response.status === 200) {
            alert("Response Submitted")
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    }, error => {
        throw error;
    }).catch(error => console.log(error))
}