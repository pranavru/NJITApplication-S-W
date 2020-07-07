import React, { Component } from 'react';
import MapComponent from '../MapComponent/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Animated } from 'react-animated-css';
import MapFilterComponent from '../MapFilterComponent/MapFilterComponent'
import axios from 'axios';
import MarkerPLaceDetailComponent from '../MarkerPlaceDetailComponent/MarkerPlaceDetailComponent';
import { Button } from 'reactstrap'

class MainComponent extends Component {

    //State props
    constructor(props) {
        super(props);

        this.baseURL = "http://18.191.247.248";
        this.state = {
            center: { lat: 40.74918, lng: -74.156204 },
            DataVuzix: {},
            isLoading: true,
            filter: true,
            detailDiv: false,
            address: null,
            id: null,
            video: "",
            personName: [],
            detailDivData: [],
        }
    }

    //Load the initial Data
    componentDidMount() { this.loadDataJson('/info') }

    //Reverse geo code - get address using lat, long
    ReverseGeoCodeAPI = (lat, long, precision) => {
        setTimeout(fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
            .then(res => res.json())
            .then(data => this.setState({ address: data.results[precision].formatted_address }))
            .catch(err => {
                console.log(err);
                this.setState({ address: "Location Unavailable" });
            }), 1500)
    }

    //Load the data from Backend - Promises
    loadDataJson(URL, objValue) {
        if (URL === '/info')
            axios.get(this.baseURL + '/info')
                .then(res => {
                    this.setState({ DataVuzix: res.data, isLoading: false })
                    this.loadMarkerAddresses(this.state.DataVuzix)
                    this.loadPersonNames(this.state.DataVuzix)
                }).catch(err => console.log(err))
        else if (URL === '/query/') {
            axios.post(this.baseURL + '/query/', objValue)
                .then(res => {
                    if (!(res.data.vuzixMap.length > 0)) {
                        alert("No data with search query")
                    } else {
                        console.log(res.data);
                        this.setState({ DataVuzix: res.data, video: res.data.video, isLoading: false })
                        this.loadMarkerAddresses(this.state.DataVuzix)
                    }
                }).catch(err => alert(err))
        }
    }

    changeVideoProps() { this.setState({ video: "", DataVuzix: { vuzixMap: [] } }) }

    AnimateMarker(markerData) {
        let data = this.state.DataVuzix;
        if (markerData !== null) {
            data.vuzixMap.map(d => {
                if (d.id === markerData.id) {
                    d.visible = true
                }
            })
            this.setState({ DataVuzix: data, id: markerData.id })
        } else {
            data.vuzixMap.map((d) => {
                if (d.id === this.state.id) {
                    d.visible = false
                }
            })
            this.setState({ DataVuzix: data, id: null })
        }
    }

    //Load addresses for Markers - Card Detail Div
    loadMarkerAddresses(data) {
        this.address = new Map();
        data.vuzixMap.map(d => {
            let key = `${d.lat.toFixed(3)}:${d.long.toFixed(3)}`;
            if (!this.address.has(key)) {
                this.address.set(key, "")
                this.fetchAndLoadAddresses(d.lat, d.long)
            }
        })
    }

    fetchAndLoadAddresses(lat, lng) {
        let key = `${lat.toFixed(3)}:${lng.toFixed(3)}`;
        Promise.all(
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
                .then(res => res.json()).then(data => {
                    this.address.set(key, data.results[4].formatted_address)
                    this.setDetailsViewTable();
                }).catch(err => console.log(err))
        ).then().catch(err => err)
    }

    //Setting Addresses in Local Storage for future access.
    setDetailsViewTable() {
        const itemStr = localStorage.getItem('addresses');
        if (!itemStr) {
            let pranavaddr = Array.from(this.address, ([key, value]) => ({ key, value }))

            //Set expiry date for 6hrs from current time when addresses are set.
            let expiryDate = new Date().getTime() + 21600000;
            let addr = {
                address: pranavaddr,
                expiry: expiryDate,
            }
            localStorage.setItem('addresses', JSON.stringify(addr))
        } else {
            const item = JSON.parse(itemStr)
            if (new Date().getTime() > item.expiry) {
                localStorage.removeItem('addresses');
                this.setDetailsViewTable()
            }
        }
    }

    //Load the Person Names in Filter
    loadPersonNames(DataVuzix) {
        let personNames = new Map([]);
        DataVuzix.vuzixMap.map(function (m) {
            if (m.person_names.length !== 0) {
                m.person_names.map(function (p) {
                    if (!personNames.has(p.person_name)) {
                        personNames.set(p.person_name, p.person_name)
                    }
                })
            }
            return;
        });
        let people = [];

        for (let item of personNames.values()[Symbol.iterator]()) {
            people.push({ checked: false, name: item });
        }
        this.setState({ personName: people })
    }

    // To render the Markers - Card Detail Div
    loadDetailedDiv = () => this.setState({ detailDiv: !this.state.detailDiv })

    //Change Detail Div Array based on location
    loadDetailedDivData = divData => this.setState({ detailDivData: divData })

    render() {
        return (
            <>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
                {!this.state.isLoading ?
                    <>
                        {/** Filter Component */}
                        <Animated animationIn="slideInLeft" animationInDuration={450} isVisible={this.state.filter} style={{ zIndex: 4, position: 'absolute' }}>
                            <div style={{ zIndex: 2, backgroundColor: 'white', width: '22vw' }}>
                                <MapFilterComponent
                                    DataVuzix={this.state.DataVuzix}
                                    video={this.state.video}
                                    loadDataJson={this.loadDataJson.bind(this)}
                                    loadPersonNames={this.loadPersonNames.bind(this)}
                                    changeVideoProps={this.changeVideoProps.bind(this)}
                                    people={this.state.personName}
                                    mapAddress={this.address}
                                    baseURL={this.baseURL}
                                />
                                {/** Button to toggle Card Detail Div */}
                                {!this.state.detailDiv ?
                                    <Button
                                        style={{ zIndex: 4, position: 'absolute', top: 15, left: '22.2vw', backgroundColor: '#2C4870' }}
                                        onClick={this.loadDetailedDiv.bind(this)}
                                    >&gt;&gt;</Button>
                                    : <></>
                                }
                            </div>
                        </Animated>

                        {/** Card Detail Div */}
                        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={this.state.detailDiv}
                            style={{ zIndex: 4, position: 'absolute', left: '23vw', backgroundColor: 'white', borderLeft: "0.5px solid gray" }}
                        >
                            {/** Button to toggle Card Detail Div */}
                            <Button style={{ position: 'absolute', left: '22vw', top: 15, zIndex: 0, backgroundColor: '#2C4870' }} onClick={this.loadDetailedDiv.bind(this)}>&lt;&lt;</Button>
                            <div className={this.state.detailDiv ? "col-md-12 displayBlock_detailedDiv" : "displayNone_detailedDiv"}
                                style={{ overflowY: 'scroll', height: "99.2vh" }} >
                                <MarkerPLaceDetailComponent
                                    baseURL={this.baseURL}
                                    data={this.state.detailDivData}
                                    mapAddress={this.address}
                                    AnimateMarker={this.AnimateMarker.bind(this)}
                                    ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
                                />
                            </div>
                        </Animated>
                        {/** Loading Map Div */}
                        <MapComponent
                            markersMap={this.state.DataVuzix}
                            details={this.state.detailDiv}
                            detailDivData={this.state.detailDivData}
                            address={this.state.address}
                            baseURL={this.baseURL}
                            center={this.state.center}
                            animateMarkerData={this.state.animateMarkerData}
                            loadDataJson={this.loadDataJson.bind(this)}
                            ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
                            loadDetailedDivData={this.loadDetailedDivData.bind(this)}
                        />
                    </>
                    :
                    <div className="loader" ></div>
                }
            </>
        )
    }
}

export default MainComponent;