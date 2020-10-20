import * as ActionTypes from './ActionTypes';

export const MapMarkerData = (state = {
    isLoading: true,
    errMess: null,
    mapMarkersData: []
}, action) => {
    switch (action.type) {
        case ActionTypes.INIT_MAP_DETAILS:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.ADD_MAPMARKERSDATA:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.DISPLAY_MARKER_DETAILS:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.LOAD_MAP:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.CHANGE_MAP_CENTER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.CLOSEST_MARKER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.MOST_RECENT_MARKER:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.SEARCH_AS_MAP_MOVES:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.MAPMARKERSDATA_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.MAPMARKERSDATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};