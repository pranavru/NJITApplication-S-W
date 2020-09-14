import * as ActionTypes from './ActionTypes';

export const SpeechText = (state = {
    isLoading: true,
    errMess: null,
    speechText: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_SPEECHTEXT:
            return { ...state, isLoading: false, errMess: null, speechText: action.payload };

        case ActionTypes.SPEECHTEXT_LOADING:
            return { ...state, isLoading: true, errMess: null, speechText: {} };

        case ActionTypes.SPEECHTEXT_FALIED:
            return { ...state, isLoading: false, errMess: action.payload, speechText: {} };

        default:
            return state;
    }
};