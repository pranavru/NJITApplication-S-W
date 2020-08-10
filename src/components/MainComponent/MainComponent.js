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
        if (this.props.DataVuzix.dataVuzix.vuzixMap !== undefined) {
            return (
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
                    <LoadingOverlay active={this.state.isActive} spinner text='Loading...'>
                        {/** Filter Component */}
                        <div className="filterStyle">
                            <MapFilterComponent DataVuzix={this.props.DataVuzix.dataVuzix} activateLoader={this.activateLoader.bind(this)} />
                            {!this.props.MapMarkersData.mapMarkersData.detail ? this.ToggleDetailDivButton(">>", "22.4vw") : <></>}
                        </div>

                        {/** Card Detail Div */}
                        {!this.props.MapMarkersData.mapMarkersData.isLoading && <Animated animationIn="fadeIn" animationOut="fadeOut" animateOnMount={false} isVisible={this.props.MapMarkersData.mapMarkersData.detail} className="detailsAnimatedStyle">
                            {this.ToggleDetailDivButton("<<", "22.5vw")}
                            <div className="detailsStyle">
                                <MarkerPLaceDetailComponent />
                            </div>
                        </Animated>}

                        {/** Loading Map Div */}
                        {this.props.MapMarkersData.mapMarkersData && <MapComponent activateLoader={this.activateLoader.bind(this)} />}

                        {/* Load Buttons for Recent and Nearest Markers */}
                        {!this.props.MapMarkersData.mapMarkersData.mapMarkers.length && this.findClosestMarkerMethod()}
                        {this.findMostRecentMarkerMethod()}
                    </LoadingOverlay>
                </div>
            )
        } else {
            return <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}> <Spinner /> </div>
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
        >
            <CardText>Pan to Closest Marker</CardText>
        </Button>;
    }

    //To Activate/De-activate the loader
    activateLoader = isActive => this.setState({ isActive })

    ToggleDetailDivButton = (displayValue, leftValue) => <Button onClick={() => this.props.displayDetails(!this.props.MapMarkersData.mapMarkersData.detail, this.props.MapMarkersData.mapMarkersData)}
        style={{ left: leftValue }} className="toggleDivButton">
        {displayValue}</Button>
}

// export default MainComponent;
export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);