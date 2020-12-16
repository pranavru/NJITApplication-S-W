import * as ActionTypes from './ActionTypes';

/**
 * Contains the state Object 
 * @typedef {Object} SpeechTextState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {Object} speechText
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} SpeechActions
 */

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