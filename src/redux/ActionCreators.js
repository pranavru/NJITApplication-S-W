import * as ActionTypes from './ActionTypes';
import { baseUrl } from "../shared/baseUrl";

export const dataVuzixLoading = () => ({
    type: ActionTypes.DATAVUZIX_LOADING
});

export const dataVuzixFailed = (errmess) => ({
    type: ActionTypes.DATAVUZIX_FALIED,
    payload: errmess
})

export const loadDataVuzix = (data) => ({
    type: ActionTypes.ADD_DATAVUZIX,
    payload: data
});

export const fetchDataVuzix = () => (dispatch) => {
    dispatch(dataVuzixLoading(true));

    return fetch(baseUrl + '/info')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => dispatch(loadDataVuzix(response)))
        .catch(error => dispatch(dataVuzixFailed(error.message)));
}