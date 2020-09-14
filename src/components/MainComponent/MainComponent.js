import React, { Component } from 'react';
import { Button, CardText, Spinner } from 'reactstrap'
import { Animated } from 'react-animated-css';
import LoadingOverlay from 'react-loading-overlay';

import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import MapComponent from '../MapComponent/MapComponent';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';

import { connect } from 'react-redux';
import { fetchDataVuzix, initMapDetails, findClosestMarker, displayDetails, findRecentMarker } from '../../redux/ActionCreators'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../MainComponent/MainComponent.css';

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
        if (typeof data.vuzixMap !== undefined && this.props.DataVuzix.isLoading === false) {
            return (
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
                    <LoadingOverlay active={this.state.isActive} spinner text='Loading...'>
                        {/** Filter Component */}
                        <div className="filterStyle">
                            <MapFilterComponent DataVuzix={data} activateLoader={this.activateLoader.bind(this)} />
                            {!markerData.detail ? this.ToggleDetailDivButton(">>", "22.4vw") : <></>}
                        </div>

                        {/** Card Detail Div */}
                        {!markerData.isLoading && <Animated animationIn="fadeIn" animationOut="fadeOut" animateOnMount={false} isVisible={markerData.detail} className="detailsAnimatedStyle">
                            {this.ToggleDetailDivButton("<<", "22.5vw")}
                            <div className="detailsStyle">
                                <MarkerPLaceDetailComponent />
                            </div>
                        </Animated>}

                        {/** Loading Map Div */}
                        {markerData && <MapComponent activateLoader={this.activateLoader.bind(this)} />}

                        {/* Load Buttons for Recent and Nearest Markers */}
                        {!this.props.DataVuzix.errMess && !markerData.mapMarkers.length && this.findClosestMarkerMethod()}
                        {!this.props.DataVuzix.errMess && this.findMostRecentMarkerMethod()}
                    </LoadingOverlay>
                </div>
            )
        } else {
            if (this.props.DataVuzix.isLoading === true && !this.props.DataVuzix.errMess) {
                return <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}> <Spinner /> </div>
            } else {
                /** Loading Map Div */
                return <MapComponent activateLoader={this.activateLoader.bind(this)} />
            }
        }
    }

    findMostRecentMarkerMethod() {
        const data = this.props.DataVuzix.dataVuzix;
        const markerData = this.props.MapMarkersData.mapMarkersData;
        return <Button
            value="Pan to Most Recent Event"
            onClick={() => {
                this.activateLoader(true);
                this.props.findRecentMarker(data.vuzixMap, markerData);
            }}
            className="panToRecentMarker"
        >
            <CardText>Pan to Most Recent Event</CardText>
        </Button>;
    }

    findClosestMarkerMethod() {
        const data = this.props.DataVuzix.dataVuzix;
        const markerData = this.props.MapMarkersData.mapMarkersData;

        return <Button
            value="Pan to Closest Marker"
            onClick={() => {
                this.activateLoader(true);
                this.props.findClosestMarker(data.vuzixMap, markerData);
            }}
            className="panToMarkerButton"
        >
            <CardText>Pan to Closest Marker</CardText>
        </Button>;
    }

    //To Activate/De-activate the loader
    activateLoader = isActive => this.setState({ isActive })

    ToggleDetailDivButton = (displayValue, leftValue) => {
        const markerData = this.props.MapMarkersData.mapMarkersData;
        return <Button onClick={() => this.props.displayDetails(!markerData.detail, markerData)}
            style={{ left: leftValue }} className="toggleDivButton">
            {displayValue}</Button>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);