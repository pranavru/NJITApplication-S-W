import React, { Component } from 'react';

import { Animated } from 'react-animated-css';
import LoadingOverlay from 'react-loading-overlay';

import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import MapComponent from '../MapComponent/MapComponent';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';
import { ButtonComponent } from '../ButtonComponent/ButtonComponent';

import { connect } from 'react-redux';
import { fetchDataVuzix, initMapDetails, findClosestMarker, displayDetails, findRecentMarker } from '../../redux/ActionCreators'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../MainComponent/MainComponent.css';
import { LoadingDivSpinner } from './LoadingDivSpinner';

const mapStateToProps = (state) => { return { DataVuzix: state.dataVuzix, MapMarkersData: state.mapMarkersData, Addresses: state.addresses } }

const mapDispatchToProps = (dispatch) => ({
    fetchDataVuzix: () => dispatch(fetchDataVuzix),
    initMapDetails: () => dispatch(initMapDetails()),
    findClosestMarker: (data, mapRef) => dispatch(findClosestMarker(data, mapRef)),
    findRecentMarker: (data, mapRef) => dispatch(findRecentMarker(data, mapRef)),
    displayDetails: (data, refObj) => dispatch(displayDetails(data, refObj))
})

class MainComponent extends Component {

    //State props
    constructor(props) {
        super(props);
        this.state = { isActive: true }
    }

    //Load the initial Data
    componentDidMount() {
        this.props.fetchDataVuzix();
        this.props.initMapDetails();
    }

    render() {
        const data = this.props.DataVuzix.dataVuzix;
        const markerData = this.props.MapMarkersData.mapMarkersData;
        const { REACT_APP_ANIMATION_CSS_URL } = process.env;

        if (typeof data.vuzixMap !== undefined && !this.props.DataVuzix.isLoading) {
            return (
                <div>
                    <link rel="stylesheet" href={REACT_APP_ANIMATION_CSS_URL} />
                    <LoadingOverlay active={this.state.isActive} spinner text='Loading...'>
                        {/** Filter Component */}
                        <div className="filterStyle">
                            {!markerData.detail ? this.ToggleDetailDivButton(">>") : <></>}
                            <MapFilterComponent DataVuzix={data} activateLoader={this.activateLoader.bind(this)} />
                        </div>

                        {/** Card Detail Div */}
                        <Animated animationIn="fadeIn" animationOut="fadeOut" animateOnMount={false} isVisible={markerData.detail} className="detailsAnimatedStyle">
                            <div className="detailsStyle">
                                {this.ToggleDetailDivButton("<<")}
                                <MarkerPLaceDetailComponent />
                            </div>
                        </Animated>

                        {/** Loading Map Div */}
                        <MapComponent activateLoader={this.activateLoader.bind(this)} />

                        {/* Load Buttons for Recent and Nearest Markers */}
                        {(!this.props.DataVuzix.errMess && !markerData.mapMarkers.length && markerData.searchAsMapMoves) &&
                            <ButtonComponent
                                name="Pan to Closest Event" class="panToMarkerButton"
                                callBackFunc={() => {
                                    this.activateLoader(true);
                                    this.props.findClosestMarker(data.vuzixMap, markerData);
                                }}
                            />}
                        {(!this.props.DataVuzix.errMess && markerData.searchAsMapMoves) &&
                            <ButtonComponent
                                name="Pan to Most Recent Event" class="panToRecentMarker"
                                callBackFunc={() => {
                                    this.activateLoader(true);
                                    this.props.findRecentMarker(data.vuzixMap, markerData);
                                }}
                            />}
                        <div className="copyrightDiv">
                            <p style={{ marginBottom: '0px' }}>Copyright © 2020 Robin</p>
                        </div>
                    </LoadingOverlay>
                </div>
            )
        } else {
            if (this.props.DataVuzix.isLoading === true && !this.props.DataVuzix.errMess) {
                return <LoadingDivSpinner />
            } else {
                /** Loading Map Div */
                return <MapComponent activateLoader={this.activateLoader.bind(this)} />
            }
        }
    }

    //To Activate/De-activate the loader
    activateLoader = isActive => this.setState({ isActive })

    ToggleDetailDivButton = (displayValue) => {
        const markerData = this.props.MapMarkersData.mapMarkersData;
        return <ButtonComponent name={displayValue} class="toggleDivButton"
            callBackFunc={() => this.props.displayDetails(!markerData.detail, markerData)} />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);