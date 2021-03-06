import * as ActionTypes from './ActionTypes';

/**
 * @param {DataVuzixState} state 
 * @param {DataVuzixAction} action 
 */

export const DataVuzix = (state = {
    isLoading: true,
    errMess: null,
    dataVuzix: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.type.ADD_DATAVUZIX:
            return { ...state, isLoading: false, errMess: null, dataVuzix: action.payload };

        case ActionTypes.type.DATAVUZIX_LOADING:
            return { ...state, isLoading: true, errMess: null, dataVuzix: [] };

        case ActionTypes.type.DATAVUZIX_FALIED:
            return { ...state, isLoading: false, errMess: action.payload, dataVuzix: [] };

        default:
            return state;
    }
};