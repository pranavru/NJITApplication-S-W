import * as ActionTypes from './ActionTypes';

export const FeedbackFormDetails = (state = {
    isLoading: true,
    errMess: null,
    feedback: null
}, action) => {
    switch (action.type) {
        case ActionTypes.INIT_FEEDBACK:
            return { ...state, isLoading: false, errMess: null, feedback: action.payload };
            
        case ActionTypes.ADD_FEEDBACK:
            return { ...state, isLoading: false, errMess: null, feedback: action.payload };

        case ActionTypes.FEEDBACK_LOADING:
            return { ...state, isLoading: true, errMess: null, feedback: null };

        case ActionTypes.FEEDBACK_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};