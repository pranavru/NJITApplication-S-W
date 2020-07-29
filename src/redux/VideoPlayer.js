import * as ActionTypes from './ActionTypes';

export const VideoPlayer = (state = {
  isLoading: true,
  errMess: null,
  video: ""
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_VIDEODATA:
      return { ...state, isLoading: false, errMess: null, video: action.payload };

    case ActionTypes.VIDEODATA_LOADING:
      return { ...state, isLoading: true, errMess: null };

    case ActionTypes.VIDEODATA_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};