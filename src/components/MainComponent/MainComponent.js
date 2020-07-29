import React, { Component } from 'react';
import { Button, CardText } from 'reactstrap'
import { Animated } from 'react-animated-css';
import LoadingOverlay from 'react-loading-overlay';

import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import MapComponent from '../MapComponent/MapComponent';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';

import { connect } from 'react-redux';
import { fetchDataVuzix, initMapDetails, findClosestMarker, displayDetails, findRecentMarker, videoPlayer } from '../../redux/ActionCreators'

import 'bootstrap/dist/css/bootstrap.min.css';

const mapStateToProps = (state) => {
    return {
        DataVuzix: state.dataVuzix,
        MapMarkersData: state.mapMarkersData,
        Addresses: state.addresses,
        InfoWindow: state.infoWindow,
        video: state.video
    }
}

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
                    <LoadingOverlay active={this.state.isActive} spinner text='Loading...'>
                        {/** Filter Component */}
                        <div style={{ backgroundColor: 'white', width: '22.2vw', position: 'absolute' }}>
                            <MapFilterComponent DataVuzix={this.props.DataVuzix.dataVuzix} activateLoader={this.activateLoader.bind(this)} />
                            {!this.props.MapMarkersData.mapMarkersData.detail ? this.ToggleDetailDivButton(">>", "22.4vw") : <></>}
                        </div>

                        {/** Card Detail Div */}
                        {!this.props.MapMarkersData.mapMarkersData.isLoading && <Animated animationIn="fadeIn" animationOut="fadeOut" animateOnMount={false} isVisible={this.props.MapMarkersData.mapMarkersData.detail}
                            style={{ zIndex: 1, position: 'absolute', left: '23vw', backgroundColor: 'white', borderLeft: "0.5px solid #e6e6e6" }}>

                            {this.ToggleDetailDivButton("<<", "22.5vw")}
                            <div style={{ overflowY: 'scroll', height: "99.2vh", width: '22.5vw' }}>
                                <MarkerPLaceDetailComponent baseURL={this.baseURL} mapAddress={this.props.Addresses.addresses.address} />
                            </div>
                        </Animated>}

                        {/** Loading Map Div */}
                        {this.props.MapMarkersData.mapMarkersData !== {} && <MapComponent
                            address={this.props.Addresses.addresses.address}
                            baseURL={this.baseURL}
                            activateLoader={this.activateLoader.bind(this)}
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
            // className="panToRecentMarker"
            style={{
                backgroundColor: '#2C4870', position: "absolute",
                left: "3%",
                bottom: "3%",
                font: "1em monospace",
                color: "#ffffff",
            }}
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
            style={{
                backgroundColor: '#2C4870', position: "absolute",
                right: "3%",
                top: "3%",
                font: "1em monospace",
                color: "#ffffff",
            }}
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