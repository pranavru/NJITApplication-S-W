import * as ActionTypes from './ActionTypes';

export const DataVuzix = (state = {
    isLoading: true,
    errMess: null,
    dataVuzix: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATAVUZIX:
            return { ...state, isLoading: false, errMess: null, dataVuzix: action.payload };

        case ActionTypes.DATAVUZIX_LOADING:
            return { ...state, isLoading: true, errMess: null, dataVuzix: [] };

        case ActionTypes.DATAVUZIX_FALIED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};