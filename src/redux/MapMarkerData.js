import * as ActionTypes from './ActionTypes';

export const MapMarkerData = (state = {
    isLoading: true,
    errMess: null,
    mapMarkersData: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MAPMARKERSDATA:
            return { ...state, isLoading: false, errMess: null, mapMarkersData: action.payload };

        case ActionTypes.MAPMARKERSDATA_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.MAPMARKERSDATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};