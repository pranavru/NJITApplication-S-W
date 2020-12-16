import * as ActionTypes from './ActionTypes';

/**
 * Contains the state Object 
 * @typedef {Object} InfoWindowState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} infoWindow
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} InfoWindowAction
 */

/**
 * @param {InfoWindowState} state 
 * @param {InfoWindowAction} action 
 */

export const InfoWindow = (state = {
    isLoading: true,
    errMess: null,
    infoWindow: null
}, action) => {
    switch (action.type) {
        case ActionTypes.type.INIT_INFOWINDOW:
            return { ...state, isLoading: false, errMess: null, infoWindow: action.payload };

        case ActionTypes.type.INFOWINDOW_LOADING:
            return { ...state, isLoading: true, errMess: null, infoWindow: null };

        case ActionTypes.type.INFOWINDOW_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};