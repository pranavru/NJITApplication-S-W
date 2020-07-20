import * as ActionTypes from './ActionTypes';

export const MapFilter = (state = {
    isLoading: true,
    errMess: null,
    mapFilter: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_INIT_MAPFILTER:
            return { ...state, isLoading: false, errMess: null, mapFilter: action.payload };

        case ActionTypes.MAPFILTER_LOADING:
            return { ...state, isLoading: true, errMess: null, mapFilter: {} };

        case ActionTypes.MAPFILTER_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.EDIT_MAPFILTER:
            return { ...state, isLoading: false, errMess: null, mapFilter: action.payload };

        default:
            return state;
    }
};