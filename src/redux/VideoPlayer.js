import * as ActionTypes from './ActionTypes';

/**
 * Contains the state Object 
 * @typedef {Object} videoURLState 
 * @property {Boolean} isLoading 
 * @property {String} errMessage
 * @property {String} videoDetails
 */

/**
 * Contains the action types to perform state updates.
 * @typedef {ActionTypes} videoURLAction
 */

/**
 * @param {videoURLState} state 
 * @param {videoURLAction} action 
 */


export const VideoPlayer = (state = {
  isLoading: true,
  errMess: null,
  videoDetails: ""
}, action) => {
  switch (action.type) {
    case ActionTypes.type.ADD_VIDEODATA:
      return { ...state, isLoading: false, errMess: null, videoDetails: action.payload };

    case ActionTypes.type.VIDEODATA_LOADING:
      return { ...state, isLoading: true, errMess: null, videoDetails: "" };

    case ActionTypes.type.VIDEODATA_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};