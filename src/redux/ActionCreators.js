import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseUrl } from "../shared/baseUrl";

//Change the isLoading attribute to true when data is updating
export const dataVuzixLoading = () => ({ type: ActionTypes.DATAVUZIX_LOADING });
export const mapFilterLoading = () => ({ type: ActionTypes.MAPFILTER_LOADING });
export const addressValueLoading = () => ({ type: ActionTypes.ADDRESSVALUE_LOADING });
export const mapMarkersDataLoading = () => ({ type: ActionTypes.MAPMARKERSDATA_LOADING });
export const infoWindowLoading = () => ({ type: ActionTypes.INFOWINDOW_LOADING });
export const videoDataLoading = () => ({ type: ActionTypes.VIDEODATA_LOADING });
export const speechTextLoading = () => ({ type: ActionTypes.SPEECHTEXT_LOADING });
export const feedbackLoading = () => ({ type: ActionTypes.FEEDBACK_LOADING });

//Send an error response if there is an error in updating the payload
export const dataVuzixFailed = (errmess) => ({ type: ActionTypes.DATAVUZIX_FALIED, payload: errmess })
export const mapFilterFailed = (errmess) => ({ type: ActionTypes.MAPFILTER_FAILED, payload: errmess })
export const addressValueFailed = (errmess) => ({ type: ActionTypes.ADDRESSVALUE_FAILED, payload: errmess });
export const mapMarkersDataFailed = (errmess) => ({ type: ActionTypes.MAPMARKERSDATA_FAILED, payload: errmess });
export const infoWindowFailed = (errmess) => ({ type: ActionTypes.INFOWINDOW_FAILED, payload: errmess });
export const videoFailed = (errmess) => ({ type: ActionTypes.VIDEODATA_FAILED, payload: errmess });
export const speechTextFailed = (errmess) => ({ type: ActionTypes.SPEECHTEXT_FALIED, payload: errmess })
export const feedbackFailed = (errmess) => ({ type: ActionTypes.FEEDBACK_FAILED, payload: errmess })

//Update the store with the payload to store the data 
export const loadDataVuzix = (data) => ({ type: ActionTypes.ADD_DATAVUZIX, payload: data });
export const loadMapFilter = (data) => ({ type: ActionTypes.ADD_INIT_MAPFILTER, payload: data });
export const loadEditedFilter = (data) => ({ type: ActionTypes.EDIT_MAPFILTER, payload: data });
export const loadAddressValue = (data) => ({ type: ActionTypes.ADD_ADDRESSVALUE, payload: data });
export const loadMapMarkerData = (data) => ({ type: ActionTypes.ADD_MAPMARKERSDATA, payload: data });
export const loadInfoWindow = (data) => ({ type: ActionTypes.INIT_INFOWINDOW, payload: data });
export const loadVideoData = (data) => ({ type: ActionTypes.ADD_VIDEODATA, payload: data });
export const loadSpeechText = (data) => ({ type: ActionTypes.ADD_SPEECHTEXT, payload: data });
export const initFeedbackForm = (data) => ({ type: ActionTypes.INIT_FEEDBACK, payload: data });
export const addFeedbackValue = (data) => ({ type: ActionTypes.ADD_FEEDBACK, payload: data });

// Fetches data when initial URL is hit.
export const fetchDataVuzix = (dispatch) => {
    dispatch(dataVuzixLoading(true));
    return fetch(baseUrl + '/signal')
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
            dispatch(loadDataVuzix(response))
        })
        .catch(error => dispatch(dataVuzixFailed(error.message)));
};

// To check if Image URL exists
const checkImageURL = (data) => {
    data.vuzixMap.forEach(obj => {
        if (obj.video)
            return fetch(baseUrl + obj.video).then(response => response.json())
                .catch(() => obj.thumbnail = "/noImageFound.png")
        else {
            return fetch(baseUrl + obj.image).then(response => response.json())
                .catch(() => obj.image = "/noImageFound.png")
        }
    })
}

// Edit Vuzix Blade data based on the Filter parameters as ```parameter``` excluding video.
export const editDataVuzix = (parameter, props) => (dispatch) => {
    parameter.videoRequired = "false";
    return axios.post(baseUrl + '/query/', parameter)
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

            dispatch(loadDataVuzix(response))
            dispatch(loadMarkers(props.DataVuzix.vuzixMap, props.MapMarkersData.mapMarkersData))
            dispatch(changeMapCenter(props.MapMarkersData.mapMarkersData))

        }).then(() => props.activateLoader(false))
        .catch(err => dispatch(dataVuzixFailed(err.message)))
}

// Edit Vuzix Blade data based on the Filter parameters as ```parameter``` including video.
export const editVideo = (parameter, props) => (dispatch) => {
    return axios.post(baseUrl + '/query/', parameter)
        .then(response => {
            if (!response) {
                alert("No video found with search query");
            } else {
                console.log(response.data)
                let videoRef = { video: baseUrl + response.data.video, thumbnail: baseUrl + response.data.thumbnail }
                return videoRef;
            }
        })
        //Update videoDetails Object with the video Data.
        .then(r => dispatch(videoPlayer(r)))
        .catch(err => dispatch(videoFailed(err.message)))
}

// Fetches filter data when initial URL is hit
export const fetchMapFilter = (data) => (dispatch) => {
    dispatch(mapFilterLoading(true));

    //Fetch Date Range, Date Values in milliseconds, People Names, Address Values for a GPS Co-ordinate.
    const { range, dateMap, personObject, addressValue } = initializeMapFilter(data);
    dispatch(addressValueLoading(true));
    dispatch(loadAddressValue(addressValue));
    dispatch(loadMapFilter({
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
        videoRequired: "false",
    }));
};

//Fetch Speech Text Values
export const fetchSpeechText = () => (dispatch) => {
    dispatch(speechTextLoading());
    return fetch(baseUrl + '/search/')
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
            dispatch(loadSpeechText(response));
        })
        .catch(error => speechTextFailed(error));
}

// Fetch Data based on Speech Values
export const fetchDataUsingSpeechText = (speech, props) => (dispatch) => {
    return axios.post(baseUrl + '/search/', { keyword: speech })
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

            dispatch(loadDataVuzix(response))
            dispatch(loadMarkers(props.DataVuzix.vuzixMap, props.MapMarkersData.mapMarkersData))
            dispatch(changeMapCenter(props.MapMarkersData.mapMarkersData))

        }).then(() => props.activateLoader(false))
        .catch(err => dispatch(dataVuzixFailed(err.message)))
}

// Edit Map Filter based on User Interaction
// newValue is an object: 
// ``` newValue={ type: String, value: String} ``` or 
// ``` newValue={ type: String, value: { type: String, value: String }} ```
export const editMapFilter = (type, newValue, props) => (dispatch) => {
    dispatch(mapFilterLoading(true))
    dispatch(videoDataLoading(true))
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
            dispatch(loadEditedFilter(newFilter));
        };
    };
    dispatch(loadEditedFilter(newFilter));
};

// Fetches initial Map details when initial URL is hit
export const initMapDetails = () => (dispatch) => {
    let mapReference = {
        center: { lat: 40.74918, lng: -74.156204 },         // center: Harrision, Newark, NJ
        detail: false,
        mapMarkers: [],                                     // Markers to load on Map
        animatedMarkerID: {},
        mapObject: null                                     // Stores map details - bounds, terrain, etc.
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

// Load map details in ```mapObject``` on map Load
export const loadMap = (mapObj, mapReference) => dispatch => {
    dispatch(mapMarkersDataLoading(true));
    mapReference.mapObject = mapObj;
    dispatch(loadMapMarkerData(mapReference));
}

// Load Details Div 
export const displayDetails = (data, mapReference) => dispatch => {
    mapReference.detail = data;
    dispatch(loadMapMarkerData(mapReference));
}

// Load markers available with in bounds of the screen after ```mapObject``` is loaded
export const loadMarkers = (data, mapReference) => (dispatch) => {
    const bounds = mapReference.mapObject.getBounds();

    if (data) {
        //Filter data based on Bounds values and return only those... available with in bounds
        const markers = data.filter(m => bounds.contains(new window.google.maps.LatLng(m.lat, m.long)))
        mapReference.mapMarkers = markers;
        mapReference.zIndex = mapReference.zIndex === undefined ? markers.length + 1 : mapReference.zIndex;
        dispatch(loadMapMarkerData(mapReference));
    }
}

//Toggle Animation of map markers
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

// Change Center of map based on the Drag / Zoom In / Zoom Out of the map by the User
export const changeMapCenter = (data) => (dispatch) => {
    data.center = { lat: data.mapObject.getCenter().lat(), lng: data.mapObject.getCenter().lng() };
    dispatch(loadMapMarkerData(data));
}

// Calculates and loads the marker which is closest to the current center of the map.
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

// Calculates and loads the most recent created marker to the current center of the map.
export const findRecentMarker = (data, mapObject) => (dispatch) => {
    let mostRecent = data ? data[0] : null;;
    data.forEach(d => mostRecent = new Date(d.created).getTime() > new Date(mostRecent.created).getTime() ? d : mostRecent)
    mapObject.center = { lat: mostRecent.lat, lng: mostRecent.long };
    mapObject.mapMarkers.push(mostRecent);
    dispatch(loadMapMarkerData(mapObject));
    dispatch(animateMapMarker(mapObject, mostRecent));
    window.setTimeout(dispatch(animateMapMarker(mapObject, null), 5000));
}

// Loads the Info window when mouse hovers over a marker
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

//Loads person names in the Filter list.
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

// Loads the video in the Video Player when clicked from an Info window
export const videoPlayer = (url) => (dispatch) => {
    dispatch(videoDataLoading(true));
    dispatch(loadVideoData(url));
};

// Pan to the Closest Marker if current Bounds contains zero markers
const rad = (x) => x * Math.PI / 180;
const sinSquare = (x) => Math.pow(Math.sin(x), 2);
const cosSquare = (x) => Math.pow(Math.cos(x), 2);

//Initialize person Information - feedback form
export const initializePersonAttr = () => dispatch => {
    let attributes = {};
    taggedPeople(attributes);
    return fetch(baseUrl + "/get_unk/")
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
                    src: baseUrl + m.imageFile, thumbnail: baseUrl + m.imageFile,
                    thumbnailWidth: 100, thumbnailHeight: 100
                }
            })
            attributes.fname = ""; attributes.lname = ""; attributes.selectedImages = [];
            dispatch(initFeedbackForm(attributes));
        })
        .catch(error => dispatch(feedbackFailed(error.message)));
}

//Edit Person Attributes Form 
export const editPersonAttr = (data, props) => (dispatch) => {
    let newFeed = props.feedback;
    switch (data.name) {
        case "fname":
            newFeed.fname = data.value;
            break;
        case "lname":
            newFeed.lname = data.value;
            break;
        case "images":
            (data.value.length > 1) ? data.value.forEach(d => newFeed.selectedImages.push(d)) : newFeed.selectedImages = data.value;
            break;
        case "galleryImage":
            var imagesTest = newFeed.images.slice();
            console.log(imagesTest)
            let img = newFeed.images[data.value];
            if (img.hasOwnProperty("isSelected")) {
                img.isSelected = !img.isSelected;
                newFeed.selectedImages = img.src;
            }
            else {
                newFeed.images.filter(m => m.isSelected).map(m => delete m.isSelected)
                img.isSelected = true;
                newFeed.selectedImages = img.src;
            }
            break;
        default:
            newFeed = props
            break;
    }
    dispatch(addFeedbackValue(newFeed));
};

//Loads person Information from the feedback form
export const personAttributes = (data) => (dispatch) => {
    dispatch(feedbackLoading(true));
    if (data.selectedImages && data.selectedImages.length > 0) {
        if ((data.fname && data.fname.length >= 3) && (data.lname && data.lname.length >= 3)) {
            const attributes = { name: data.fname + ' ' + data.lname, file: data.selectedImages };
            dispatch(addFeedbackValue(attributes));
            return axios.post(baseUrl + '/feedback/', attributes)
                .then(res => {
                    if (res.status === 200) {
                        alert("Response Submitted")
                    }
                })
                .catch((err) => alert(err));
        } else {
            dispatch(feedbackFailed("Person name should be at least 3 letters"));
        }
    } else {
        dispatch(feedbackFailed("No Images Found. Please enter an Image"));
    }
}

//Add Already Tagged People 
export const taggedPeople = (attribute) => {
    return fetch(baseUrl + "/get_people/")
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
        .then(res => attribute.tags = res)
        .catch(error => console.log(error));
}

 // if (newFeed.selectedImages.length > 0) {
            //     newFeed.images.filter(i => i.isSelected === true).map(i => { return i.isSelected = false });
            //     newFeed.images[data.value].isSelected = true;
            //     newFeed.selectedImages = newFeed.images[data.value].src;
            // }
            // else {
            //     if (typeof data.value === String) {
            //         newFeed.selectedImages = data.value;
            //     } else {
            //         newFeed.images[data.value].isSelected = true;
            //         newFeed.selectedImages = newFeed.images[data.value].src;
            //     }
            // }
            // newFeed.images.filter((i, index) => index === data.value).map(i => {
            //     if (i.isSelected) {
            //         i.isSelected = false;
            //         newFeed.selectedImages.filter(s => s === i.src).map(i => newFeed.selectedImages.pop(i));
            //     } else {
            //         i.isSelected = true;
            //         newFeed.selectedImages.push(i.src);
            //     }
            //     return i;
            // })