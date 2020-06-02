import React, { Component } from 'react';
import MapComponent from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Animated } from 'react-animated-css';
import MapFilterComponent from './components/MapFilterComponent'
import axios from 'axios';
import MarkerPLaceDetailComponent from './components/MarkerPlaceDetailComponent';
import { Button } from 'reactstrap'

class App extends Component {

  //State props
  constructor(props) {
    super(props);

    this.state = {
      filter: true,
      DataVuzix: {},
      baseURL: "https://localhost:3443",
      video: "",
      isLoading: true,
      detailDiv: true,
      address: "",
      addresses: [],
      animateMarkerData: {},
      id: null
    }

  }

  //Load the initial Data
  componentDidMount() {
    this.loadDataJson('/vuzixMap')
  }

  //Reverse geo code - get address using lat, long
  ReverseGeoCodeAPI = (lat, long) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
      .then(res => res.json())
      .then(data => this.setState({ address: data.results[0].formatted_address }))
      .catch(err => console.log(err))
  }

  //Load the data from Backend - Promises
  loadDataJson(URL, objValue) {
    if (URL === '/vuzixMap')
      axios.get(this.state.baseURL + '/vuzixMap').then(
        res => {
          this.setState({ DataVuzix: res.data, isLoading: false })
          this.loadMarkerAddresses(this.state.DataVuzix)
        })
    else if (URL === '/vuzixMap/video') {
      console.log(objValue)
      axios.get(this.state.baseURL + '/vuzixMap/video', objValue).then(
        res => {
          this.setState({ DataVuzix: res.data, video: res.data.video, isLoading: false })
          this.loadMarkerAddresses(this.state.DataVuzix)
        })
    }

  }

  AnimateMarker(markerData) {
    // console.log(markerData)
    let data = this.state.DataVuzix;
    console.log(data)
    if (markerData !== null) {
      data.vuzixMap.map((d) => {
        if (d.id === markerData.id) {
          d.visible = true
        }
      })
      this.setState({ DataVuzix: data, id: markerData.id })
    }
    else {
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
    let details = [];
    data.vuzixMap.map(d => {
      details.push({ data: d, address: "data.results[0].formatted_address" })
    })
    this.setState({ addresses: details })
    console.log(details.length)
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
    });
    return personNames;
  }

  // To render the Markers - Card Detail Div
  loadDetailedDiv() { this.setState({ detailDiv: !this.state.detailDiv }) }

  render() {
    return (
      <>
        {
          <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
            {!this.state.isLoading ?
              <>
                {/** Filter Component */}
                <Animated
                  animationIn="slideInLeft"
                  animationInDuration={450}
                  animationOut="slideOutLeft"
                  isVisible={this.state.filter}
                  style={{ zIndex: 4, position: 'absolute' }}
                >
                  <div style={{ zIndex: 2, backgroundColor: 'white', width: '30vw' }}>
                    <MapFilterComponent
                      DataVuzix={this.state.DataVuzix}
                      video={this.state.video}

                      loadDataJson={this.loadDataJson.bind(this)}
                      loadPersonNames={this.loadPersonNames.bind(this)}
                    />
                    {/** Button to toggle Card Detail Div */}
                    {!this.state.detailDiv ?
                      <Button
                        style={{ zIndex: 4, position: 'absolute', top: 15, left: '30vw' }}
                        onClick={this.loadDetailedDiv.bind(this)}
                      >&gt;&gt;</Button>
                      : <></>
                    }
                  </div>
                </Animated>

                {/** Card Detail Div */}
                <Animated
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                  animationInDuration={600}
                  animationOutDuration={600}
                  isVisible={this.state.detailDiv}
                  style={{ zIndex: 4, position: 'absolute', left: '30vw', backgroundColor: 'white', borderLeft: "1px solid black" }}
                >
                  {this.state.addresses.length > 0 ?
                    <>
                      {/** Button to toggle Card Detail Div */}
                      <Button
                        style={{ position: 'absolute', left: '22vw', top: 15 }}
                        onClick={this.loadDetailedDiv.bind(this)}
                      >&lt;&lt;</Button>
                      <div
                        style={{ overflow: 'scroll', height: '100vh' }}
                        className={this.state.detailDiv ? "col-md-12 displayBlock_detailedDiv" : "displayNone_detailedDiv"}
                      >
                        <MarkerPLaceDetailComponent
                          style={{ marginBottom: 8 }}

                          data={this.state.addresses}
                          AnimateMarker={this.AnimateMarker.bind(this)}
                          ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
                        />
                      </div>
                    </>
                    : <div
                      className="loader"
                    ></div>
                  }
                </Animated>
              </>
              :
              <div
                style={{ alignSelf: "center", justifyContent: "center" }}
                className="loader"
              ></div>
            }

            {/** Loading Map Div */}
            <MapComponent
              markersMap={this.state.DataVuzix}
              details={this.state.detailDiv}
              address={this.state.address}
              animateMarkerData={this.state.animateMarkerData}
              loadDataJson={this.loadDataJson.bind(this)}
              ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
            />
          </>
        }
      </>
    )
  }
}


export default App;