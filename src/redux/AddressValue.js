import * as ActionTypes from './ActionTypes';

/**
 * @param {VuzixAddressState} state 
 * @param {VuzixAddressAction} action 
 */

export const AddressValue = (state = {
    isLoading: true,
    errMess: null,
    addresses: []
}, action) => {
    switch (action.type) {
        case ActionTypes.type.ADD_ADDRESSVALUE:
            return { ...state, isLoading: false, errMess: null, addresses: action.payload };

        case ActionTypes.type.ADDRESSVALUE_LOADING:
            return { ...state, isLoading: true, errMess: null, addresses: [] };

        case ActionTypes.type.ADDRESSVALUE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};