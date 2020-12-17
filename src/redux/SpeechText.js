import * as ActionTypes from './ActionTypes';

/**
 * @param {SpeechTextState} state 
 * @param {SpeechActions} action 
 */

export const SpeechText = (state = {
    isLoading: true,
    errMess: null,
    speechText: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.type.ADD_SPEECHTEXT:
            return { ...state, isLoading: false, errMess: null, speechText: action.payload };

        case ActionTypes.type.SPEECHTEXT_LOADING:
            return { ...state, isLoading: true, errMess: null, speechText: {} };

        case ActionTypes.type.SPEECHTEXT_FALIED:
            return { ...state, isLoading: false, errMess: action.payload, speechText: {} };

        default:
            return state;
    }
};