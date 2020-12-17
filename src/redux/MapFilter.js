import * as ActionTypes from './ActionTypes';

/**
 * @param {FilterState} state 
 * @param {FilterAction} action 
 */


export const MapFilter = (state = {
    isLoading: true,
    errMess: null,
    mapFilter: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.type.ADD_INIT_MAPFILTER:
            return { ...state, isLoading: false, errMess: null, mapFilter: action.payload };

        case ActionTypes.type.MAPFILTER_LOADING:
            return { ...state, isLoading: true, errMess: null, mapFilter: {} };

        case ActionTypes.type.MAPFILTER_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.type.EDIT_MAPFILTER:
            return { ...state, isLoading: false, errMess: null, mapFilter: action.payload };

        default:
            return state;
    }
};