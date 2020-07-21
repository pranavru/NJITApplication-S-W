import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { DataVuzix } from './DataVuzix';
import { MapFilter } from './MapFilter';
import { MapMarkerData } from './MapMarkerData';
import { AddressValue } from './AddressValue';
import { InfoWindow } from './InfoWindow';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dataVuzix: DataVuzix,
            mapFilter: MapFilter,
            mapMarkersData: MapMarkerData,
            addresses: AddressValue,
            infoWindow: InfoWindow
        }),
        applyMiddleware(thunk)

    );
    return store;
}