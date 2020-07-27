import React, { Component } from 'react';
import { Button, CardText } from 'reactstrap'
import { Animated } from 'react-animated-css';
import LoadingOverlay from 'react-loading-overlay';

import axios from 'axios';

import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import MapComponent from '../MapComponent/MapComponent';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';

import { connect } from 'react-redux';
import { fetchDataVuzix, fetchMapFilter, editMapFilter, updateMapAddressOnExpiry, initMapDetails, animateMapMarker, loadMarkers, infoWindowMarker, changeMapCenter, findClosestMarker, loadMap, displayDetails, editDataVuzix, findRecentMarker } from '../../redux/ActionCreators'

import 'bootstrap/dist/css/bootstrap.min.css';

const mapStateToProps = (state) => {
    return {
        DataVuzix: state.dataVuzix,
        MapFilter: state.mapFilter,
        MapMarkersData: state.mapMarkersData,
        Addresses: state.addresses,
        InfoWindow: state.infoWindow
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchDataVuzix: () => dispatch(fetchDataVuzix),
    editDataVuzix: (obj, loader) => dispatch(editDataVuzix(obj, loader)),
    fetchMapFilter: (data, dateMap) => dispatch(fetchMapFilter(data, dateMap)),
    editMapFilter: (type, newValue, props) => dispatch(editMapFilter(type, newValue, props)),
    initMapDetails: () => dispatch(initMapDetails()),
    loadMap: (data, refObj) => dispatch(loadMap(data, refObj)),
    changeMapCenter: (data) => dispatch(changeMapCenter(data)),
    loadMarkers: (data, mapObj, mapReference, type) => dispatch(loadMarkers(data, mapObj, mapReference, type)),
    animateMapMarker: (data, marker) => dispatch(animateMapMarker(data, marker)),
    infoWindowMarker: (data) => dispatch(infoWindowMarker(data)),
    findClosestMarker: (data, mapRef) => dispatch(findClosestMarker(data, mapRef)),
    findRecentMarker: (data, mapRef) => dispatch(findRecentMarker(data, mapRef)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry()),
    displayDetails: (data, refObj) => dispatch(displayDetails(data, refObj))
})


class MainComponent extends Component {

    //State props
    constructor(props) {
        super(props);

        this.baseURL = "http://18.191.247.248";
        this.state = { isActive: true }
    }

    //Load the initial Data
    componentDidMount() {
        this.props.fetchDataVuzix();
        this.props.initMapDetails();
    }

    render() {
        if (this.props.DataVuzix.dataVuzix.vuzixMap !== undefined) {
            return (
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
                    <LoadingOverlay
                        active={this.state.isActive}
                        spinner
                        text='Loading...'
                    >
                        {/** Filter Component */}
                        {this.props.MapFilter.mapFilter !== {} && <div style={{ zIndex: 2, backgroundColor: 'white', width: '22.2vw', position: 'absolute' }}>
                            <MapFilterComponent
                                DataVuzix={this.props.DataVuzix.dataVuzix}
                                MapFilter={this.props.MapFilter}
                                mapDetailsData={this.props.MapMarkersData.mapMarkersData}
                                fetchMapFilter={this.props.fetchMapFilter}
                                editMapFilter={this.props.editMapFilter}
                                editDataVuzix={this.props.editDataVuzix}
                                activateLoader={this.activateLoader.bind(this)}
                            // changeVideoProps={this.changeVideoProps.bind(this)}
                            />

                            {!this.props.MapMarkersData.mapMarkersData.detail ?
                                this.ToggleDetailDivButton(">>", "22.4vw")
                                : <></>}
                        </div>}

                        {/** Card Detail Div */}
                        {!this.props.MapMarkersData.mapMarkersData.isLoading && <Animated animationIn="fadeIn" animationOut="fadeOut" animateOnMount={false} isVisible={this.props.MapMarkersData.mapMarkersData.detail}
                            style={{ zIndex: 1, position: 'absolute', left: '23vw', backgroundColor: 'white', borderLeft: "0.5px solid #e6e6e6" }}>

                            {this.ToggleDetailDivButton("<<", "22.5vw")}
                            <div style={{ overflowY: 'scroll', height: "99.2vh", width: '22.5vw' }}>
                                <MarkerPLaceDetailComponent
                                    baseURL={this.baseURL}
                                    mapReference={this.props.MapMarkersData.mapMarkersData}
                                    mapAddress={this.props.Addresses.addresses.address}
                                    animateMapMarker={this.props.animateMapMarker}
                                />
                            </div>
                        </Animated>}

                        {/** Loading Map Div */}
                        {this.props.MapMarkersData.mapMarkersData !== {} && <MapComponent
                            DataVuzix={this.props.DataVuzix.dataVuzix.vuzixMap}
                            mapDetailsData={this.props.MapMarkersData.mapMarkersData}
                            address={this.props.Addresses.addresses.address}
                            infoWindow={this.props.InfoWindow}
                            baseURL={this.baseURL}
                            activateLoader={this.activateLoader.bind(this)}
                            changeMapCenter={this.props.changeMapCenter}
                            findClosestMarker={this.props.findClosestMarker}
                            loadMarkers={this.props.loadMarkers}
                            infoWindowMarker={this.props.infoWindowMarker}
                            loadMap={this.props.loadMap}
                        />}
                        {!this.props.MapMarkersData.mapMarkersData.mapMarkers.length && this.findClosestMarkerMethod()}
                        {this.findMostRecentMarkerMethod()}
                    </LoadingOverlay>
                </div>
            )
        } else {
            return <div className="loader"></div>
        }
    }

    findMostRecentMarkerMethod() {
        return <Button
            value="Pan to Most Recent Event"
            onClick={() => {
                this.activateLoader(true);
                this.props.findRecentMarker(this.props.DataVuzix.dataVuzix.vuzixMap, this.props.MapMarkersData.mapMarkersData);
            }}
            className="panToRecentMarker"
            style={{ backgroundColor: '#2C4870' }}
        >
            <CardText>Pan to Most Recent Event</CardText>
        </Button>;
    }

    findClosestMarkerMethod() {
        return <Button
            value="Pan to Closest Marker"
            onClick={() => {
                this.activateLoader(true);
                this.props.findClosestMarker(this.props.DataVuzix.dataVuzix.vuzixMap, this.props.MapMarkersData.mapMarkersData);
            }}
            className="panToMarkerButton"
            style={{ backgroundColor: '#2C4870' }}
        >
            <CardText>Pan to Closest Marker</CardText>
        </Button>;
    }

    changeVideoProps = () => this.setState({ video: "", DataVuzix: { vuzixMap: [] } })

    //To Activate/De-activate the loader
    activateLoader = isActive => this.setState({ isActive })

    ToggleDetailDivButton = (displayValue, leftValue) => <Button onClick={() => this.props.displayDetails(!this.props.MapMarkersData.mapMarkersData.detail, this.props.MapMarkersData.mapMarkersData)}
        style={{ zIndex: 4, position: 'absolute', top: "3%", left: leftValue, backgroundColor: '#2C4870' }}>
        {displayValue}</Button>
}

// export default MainComponent;
export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);