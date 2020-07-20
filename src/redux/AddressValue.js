import * as ActionTypes from './ActionTypes';

export const AddressValue = (state = {
    isLoading: true,
    errMess: null,
    addresses: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ADDRESSVALUE:
            return { ...state, isLoading: false, errMess: null, addresses: action.payload };

        case ActionTypes.ADDRESSVALUE_LOADING:
            return { ...state, isLoading: true, errMess: null, addresses: [] };

        case ActionTypes.ADDRESSVALUE_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};