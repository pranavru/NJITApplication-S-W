import * as ActionTypes from './ActionTypes';

export const VideoPlayer = (state = {
  isLoading: true,
  errMess: null,
  videoDetails: ""
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_VIDEODATA:
      return { ...state, isLoading: false, errMess: null, videoDetails: action.payload };

    case ActionTypes.VIDEODATA_LOADING:
      return { ...state, isLoading: true, errMess: null, videoDetails: "" };

    case ActionTypes.VIDEODATA_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};