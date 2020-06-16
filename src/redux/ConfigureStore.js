import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { DataVuzix } from './DataVuzix';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dataVuzix: DataVuzix
        }),
        applyMiddleware(thunk, logger)

    );
    return store;
}
