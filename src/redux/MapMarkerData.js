import * as ActionTypes from './ActionTypes';

/**
 * Contains the state Object 
 * @typedef {Object} MapState
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} mapMarkersData
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} MapActions
 */

/**
 * @param {MapState} state 
 * @param {MapActions} action 
 */


export const MapMarkerData = (state = {
    isLoading: true,
    errMess: null,
    mapMarkersData: []
}, action) => {
    switch (action.type) {
        case ActionTypes.type.INIT_MAP_DETAILS:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.ADD_MAPMARKERSDATA:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.DISPLAY_MARKER_DETAILS:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.LOAD_MAP:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.CHANGE_MAP_CENTER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.CLOSEST_MARKER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.MOST_RECENT_MARKER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.SEARCH_AS_MAP_MOVES:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.type.MAPMARKERSDATA_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.type.MAPMARKERSDATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};