import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { Animated } from 'react-animated-css';
import LoadingOverlay from 'react-loading-overlay';

import axios from 'axios';

import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import MapComponent from '../MapComponent/MapComponent';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';

import { connect } from 'react-redux';
import { fetchDataVuzix, fetchMapFilter, editMapFilter, updateMapAddressOnExpiry, initMapDetails, animateMapMarker, loadMarkers, infoWindowMarker, } from '../../redux/ActionCreators'

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
    fetchMapFilter: (data, dateMap) => dispatch(fetchMapFilter(data, dateMap)),
    initMapDetails: () => dispatch(initMapDetails()),
    loadMarkers: (data, mapObj, mapReference, type) => dispatch(loadMarkers(data, mapObj, mapReference, type)),
    editMapFilter: (type, newValue, props) => dispatch(editMapFilter(type, newValue, props)),
    updateMapAddressOnExpiry: () => dispatch(updateMapAddressOnExpiry()),
    animateMapMarker: (data, marker) => dispatch(animateMapMarker(data, marker)),
    infoWindowMarker: (data) => dispatch(infoWindowMarker(data))
})


class MainComponent extends Component {

    //State props
    constructor(props) {
        super(props);

        this.baseURL = "http://18.191.247.248";
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
                        active={this.props.MapMarkersData.isLoading}
                        spinner
                        text='Loading...'
                    >
                        {/** Filter Component */}
                        {this.props.MapFilter.mapFilter !== {} && this.animatedFilterComponent()}

                        {/** Card Detail Div */}
                        {this.animatedDetailComponent()}

                        {/** Loading Map Div */}
                        {this.props.MapMarkersData.mapMarkersData !== {} && this.loadMap()}
                    </LoadingOverlay>
                </div>
            )
        } else {
            return <div className="loader"></div>
        }
    }

    //Load the data from Backend - Promises
    loadDataJson(URL, objValue) {
        if (URL === '/info')
            axios.get(this.baseURL + '/info')
                .then(res => {
                    this.setState({ DataVuzix: res.data, isLoading: false })
                    this.startDate = new Date(res.data.startDate)
                    this.endDate = new Date(res.data.endDate)
                    this.loadMarkerAddresses(this.state.DataVuzix)
                    this.loadPersonNames(this.state.DataVuzix)
                }).catch(err => console.log(err))
        else if (URL === '/query/') {
            this.activateLoader(true)
            axios.post(this.baseURL + '/query/', objValue)
                .then(res => {
                    if (!(res.data.vuzixMap.length > 0)) {
                        alert("No data with search query")
                        this.activateLoader(false);
                    } else {
                        console.log(res.data)
                        this.setState({ DataVuzix: res.data, video: res.data.video, isLoading: false, center: { lat: 40.74918, lng: -74.15620 } })
                    }
                }).catch(err => alert(err))
        }
    }

    //Reverse geo code - get address using lat, long
    ReverseGeoCodeAPI = (lat, long, precision) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
            .then(res => res.json())
            .then(data => this.setState({ address: data.results[precision].formatted_address }))
            .catch(err => {
                console.log(err);
                this.setState({ address: "Location Unavailable" });
            })
    }

    changeVideoProps = () => this.setState({ video: "", DataVuzix: { vuzixMap: [] } })

    //Animation to make Marker Bounce
    AnimateMarker(markerData) {
        let data = this.state.DataVuzix;
        if (markerData !== null) {
            data.vuzixMap
                .filter((d) => d.id === markerData.id)
                .map(d => {
                    if (d.id === markerData.id) {
                        d.visible = true
                    }
                })
            this.setState({ DataVuzix: data, id: markerData.id })
        } else {
            data.vuzixMap
                .filter((d) => d.visible === true)
                .map((d) => {
                    if (d.id === this.state.id) {
                        d.visible = false
                    }
                })
            this.setState({ DataVuzix: data, id: null })
        }
    }

    // To render the Markers - Card Detail Div
    loadDetailedDiv = () => this.setState({ detailDiv: !this.state.detailDiv })

    //Change Detail Div Array based on location
    loadDetailedDivData = (detailDivData, isActive) => this.setState({ detailDivData, isActive })

    //To Activate/De-activate the loader
    activateLoader = isActive => this.setState({ isActive })

    //Change Center if it doesn't Lie in Bounds
    changeCenter = (mapR) => this.setState({ center: { lat: mapR.getCenter().lat(), lng: mapR.getCenter().lng() - (4 * Math.pow(10, -6)) } })

    // Pan to the Closest Marker if current Bounds contains zero markers
    rad = (x) => x * Math.PI / 180;
    sinSquare = (x) => Math.pow(Math.sin(x), 2);
    cosSquare = (x) => Math.pow(Math.cos(x), 2);
    findClosestMarker = () => {
        let latLng = this.state.center;
        let R = 6371; // radius of earth in km
        let distances = [];
        let closest = -1;
        let data = this.state.DataVuzix.vuzixMap;
        for (let i = 0; i < data.length; i++) {
            let mlatLng = { lat: data[i].lat, lng: data[i].long };
            let dLat = this.rad(mlatLng.lat - latLng.lat);
            let dLong = this.rad(mlatLng.lng - latLng.lng);
            let a = this.sinSquare(dLat / 2) + this.cosSquare(this.rad(latLng.lat)) * this.sinSquare(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c;
            distances[i] = d;
            if (closest == -1 || d < distances[closest]) {
                closest = i;
            }
        }
        const center = { lat: data[closest].lat, lng: data[closest].long };
        this.setState({ center });
    }

    loadMap() {
        return (
            <MapComponent
                DataVuzix={this.props.DataVuzix.dataVuzix.vuzixMap}
                mapDetailsData={this.props.MapMarkersData.mapMarkersData}
                address={this.props.Addresses.addresses.address}
                infoWindow={this.props.InfoWindow}
                baseURL={this.baseURL}
                // activateLoader={this.activateLoader.bind(this)}
                // changeCenter={this.changeCenter.bind(this)}
                findClosestMarker={this.findClosestMarker.bind(this)}
                loadMarkers={this.props.loadMarkers}
                infoWindowMarker={this.props.infoWindowMarker}
            />
        );
    }

    animatedDetailComponent() {
        return <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.props.MapMarkersData.mapMarkersData.detail}
            style={{ zIndex: 1, position: 'absolute', left: '23vw', backgroundColor: 'white', borderLeft: "0.5px solid gray" }}>

            {this.ToggleDetailDivButton("<<", "23vw")}
            <div style={{ overflowY: 'scroll', height: "99.2vh", marginLeft: '3%', width: '22vw' }}>
                <MarkerPLaceDetailComponent
                    baseURL={this.baseURL}
                    data={this.props.MapMarkersData.mapMarkersData.mapMarkers}
                    mapReference={this.props.MapMarkersData.mapMarkersData}
                    mapAddress={this.props.Addresses.addresses.address}
                    animateMapMarker={this.props.animateMapMarker}
                />
            </div>
        </Animated>;
    }

    animatedFilterComponent() {
        return <Animated animationIn="slideInLeft" animationInDuration={450} style={{ zIndex: 4, position: 'absolute' }}>
            <div style={{ zIndex: 2, backgroundColor: 'white', width: '22.2vw' }}>
                <MapFilterComponent
                    DataVuzix={this.props.DataVuzix.dataVuzix}
                    MapFilter={this.props.MapFilter}
                    fetchMapFilter={this.props.fetchMapFilter}
                    editMapFilter={this.props.editMapFilter}
                // changeVideoProps={this.changeVideoProps.bind(this)}
                />

                {!this.props.MapMarkersData.mapMarkersData.detail ?
                    this.ToggleDetailDivButton(">>", "22.3vw")
                    : <></>}
            </div>
        </Animated>;
    }

    ToggleDetailDivButton = (displayValue, leftValue) => <Button onClick={() => this.props.loadMarkers([], null, this.props.MapMarkersData.mapMarkersData, "displayDetails")}
        style={{ zIndex: 4, position: 'absolute', top: 12, left: leftValue, backgroundColor: '#2C4870' }}>
        {displayValue}</Button>

}

// export default MainComponent;
export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);