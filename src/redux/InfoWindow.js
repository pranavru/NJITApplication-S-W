import * as ActionTypes from './ActionTypes';

export const InfoWindow = (state = {
    isLoading: true,
    errMess: null,
    infoWindow: null
}, action) => {
    switch (action.type) {
        case ActionTypes.INIT_INFOWINDOW:
            return { ...state, isLoading: false, errMess: null, infoWindow: action.payload };

        case ActionTypes.INFOWINDOW_LOADING:
            return { ...state, isLoading: true, errMess: null, infoWindow: null };

        case ActionTypes.INFOWINDOW_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};