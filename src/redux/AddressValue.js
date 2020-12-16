import * as ActionTypes from './ActionTypes';

/**
 * Contains the state Object 
 * @typedef {Object} VuzixAddressState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Array} addresses
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} VuzixAddressAction
 */

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