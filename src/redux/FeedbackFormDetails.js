import * as ActionTypes from './ActionTypes';

/**
 * @param {FeedbackFormState} state 
 * @param {FeedbackFormAction} action 
 */
export const FeedbackFormDetails = (state = {
    isLoading: true,
    errMess: null,
    feedback: null
}, action) => {
    switch (action.type) {
        case ActionTypes.type.INIT_FEEDBACK:
            return { ...state, isLoading: false, errMess: null, feedback: action.payload };
            
        case ActionTypes.type.ADD_FEEDBACK:
            return { ...state, isLoading: false, errMess: null, feedback: action.payload };

        case ActionTypes.type.FEEDBACK_LOADING:
            return { ...state, isLoading: true, errMess: null, feedback: null };

        case ActionTypes.type.FEEDBACK_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};