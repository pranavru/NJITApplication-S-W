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
      center: { lat: 40.74918, lng: -74.156204 },
      baseURL: "http://18.191.247.248",
      DataVuzix: {},
      isLoading: true,
      filter: true,
      detailDiv: false,
      address: "",
      id: null,
      video: "",
      personName: []
    }
  }

  //Load the initial Data
  componentDidMount() {
    this.loadDataJson('/info')
  }

  //Reverse geo code - get address using lat, long
  ReverseGeoCodeAPI = (lat, long, precision) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
      .then(res => res.json())
      .then(data => {
        // console.log(data.results)
        this.setState({ address: data.results[precision].formatted_address })
      })
      .catch(err => console.log(err))
  }

  //Load the data from Backend - Promises
  loadDataJson(URL, objValue) {
    if (URL === '/info')
      axios.get(this.state.baseURL + '/info')
        .then(res => {
          this.setState({ DataVuzix: res.data, isLoading: false })
          this.loadMarkerAddresses(this.state.DataVuzix)
          this.loadPersonNames(this.state.DataVuzix)
        })
    else if (URL === '/query/') {
      console.log(this.state.baseURL + '/query/', objValue)
      axios.post(this.state.baseURL + '/query/', objValue)
        .then(res => {
          console.log(res.data)
          this.setState({ DataVuzix: res.data, video: this.state.baseURL + res.data.video, isLoading: false })
          this.loadMarkerAddresses(this.state.DataVuzix)
          this.loadPersonNames(this.state.DataVuzix)
        })
    }
  }

  AnimateMarker(markerData) {
    let data = this.state.DataVuzix;
    if (markerData !== null) {
      data.vuzixMap.map(d => {
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
    this.address = new Map();
    data.vuzixMap.map(d => {
      let key = `${d.lat.toFixed(3)}:${d.long.toFixed(3)}`;
      if (!this.address.has(key)) {
        this.address.set(key, "")
        this.fetchAndLoadAddresses(d.lat, d.long)
      }
    })

    // this.setState({ addresses: details })
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

  setDetailsViewTable() {
    let pranavaddr = Array.from(this.address, ([key, value]) => ({ key, value }))
    let addr = { address: pranavaddr }
    localStorage.setItem('addresses', JSON.stringify(addr))
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
    let people = [];

    for (let item of personNames.values()[Symbol.iterator]()) {
      people.push({ checked: false, name: item });
    }
    this.setState({ personName: people })
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
                <Animated animationIn="slideInLeft" animationInDuration={450} isVisible={this.state.filter} style={{ zIndex: 4, position: 'absolute' }}>
                  <div style={{ zIndex: 2, backgroundColor: 'white', width: '30vw' }}>
                    <MapFilterComponent
                      DataVuzix={this.state.DataVuzix}
                      video={this.state.video}
                      loadDataJson={this.loadDataJson.bind(this)}
                      loadPersonNames={this.loadPersonNames.bind(this)}
                      people={this.state.personName}
                      mapAddress={this.address}
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
                <Animated animationIn="fadeIn" animationOut="fadeOut" animationInDuration={600} animationOutDuration={600} isVisible={this.state.detailDiv}
                  style={{ zIndex: 4, position: 'absolute', left: '30vw', backgroundColor: 'white', borderLeft: "0.5px solid gray" }}
                >
                  {/** Button to toggle Card Detail Div */}
                  <Button style={{ position: 'absolute', left: '22vw', top: 15 }} onClick={this.loadDetailedDiv.bind(this)}>&lt;&lt;</Button>
                  <div className={this.state.detailDiv ? "col-md-12 displayBlock_detailedDiv" : "displayNone_detailedDiv"}
                    style={{ overflow: 'scroll', height: '99vh' }} >
                    {
                      this.address !== undefined ?
                        <MarkerPLaceDetailComponent
                          baseURL={this.state.baseURL}
                          data={this.state.DataVuzix}
                          mapAddress={this.address}
                          AnimateMarker={this.AnimateMarker.bind(this)}
                          ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
                        />
                        :
                        <div className='loader'></div>
                    }
                  </div>
                </Animated>
                {/** Loading Map Div */}
                <MapComponent
                  markersMap={this.state.DataVuzix}
                  details={this.state.detailDiv}
                  address={this.state.address}
                  baseURL={this.state.baseURL}
                  center={this.state.center}
                  animateMarkerData={this.state.animateMarkerData}
                  loadDataJson={this.loadDataJson.bind(this)}
                  ReverseGeoCodeAPI={this.ReverseGeoCodeAPI.bind(this)}
                />
              </>
              :
              <div className="loader" ></div>
            }
          </>
        }
      </>
    )
  }
}

export default App;