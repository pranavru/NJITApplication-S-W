//Library Imports
import { createStore, combineReducers, applyMiddleware } from 'redux';

//Middleware Imports
import thunk from 'redux-thunk';
import logger from 'redux-logger';

//Descriptive Reducers methods to mutate the state
import { DataVuzix } from './DataVuzix';
import { MapFilter } from './MapFilter';
import { MapMarkerData } from './MapMarkerData';
import { AddressValue } from './AddressValue';
import { InfoWindow } from './InfoWindow';
import { VideoPlayer } from './VideoPlayer';
import { SpeechText } from './SpeechText';
import { FeedbackFormDetails } from './FeedbackFormDetails';

/**
 * ConfigureStore access and creates the state of the store.
 * combineReducer method access the state store.
 * Its action are methods defined inside the components imported above using which the state can be mutated
 **/
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dataVuzix: DataVuzix,
            mapFilter: MapFilter,
            mapMarkersData: MapMarkerData,
            addresses: AddressValue,
            infoWindow: InfoWindow,
            videoDetails: VideoPlayer,
            speechText: SpeechText,
            feedback: FeedbackFormDetails,
        }),
        
        /*
         * Check the application environment 
         * If the application is in development or testing phase, data is logged in to the console using "redux-logger"
         * Else logger is blocked if the application is in Production
        */ 
        process.env.NODE_ENV === 'development' | 'test' ? applyMiddleware(thunk, logger) : applyMiddleware(thunk)

    );
    return store;
}