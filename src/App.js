import React, { Component } from 'react';
import MapComponent from './components/MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Animated } from 'react-animated-css';
import MapFilterComponent from './components/MapFilterComponent'
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: true,
      DataVuzix: {},
      baseURL: "https://localhost:3443",
      video: "",
      isLoading: true
    }

  }

  componentDidMount() {
    this.loadDataJson('/vuzixMap')
  }

  loadDataJson(URL) {
    if (URL === '/vuzixMap')
      axios.get(this.state.baseURL + '/vuzixMap').then(
        res => {
          this.setState({ DataVuzix: res.data, isLoading: false })
        })
    else if (URL === '/vuzixMap/video')
      axios.get(this.state.baseURL + '/vuzixMap/video').then(
        res => {
          this.setState({ DataVuzix: res.data, video: res.data.video, isLoading: false })
        })

  }

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

  loadDateValues() {
    return [this.state.DataVuzix.startDate, this.state.DataVuzix.endDate]
  }

  render() {
    return (
      <>
        {
          <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css" />
            {!this.state.isLoading ?  <Animated animationIn="slideInLeft" animationInDuration={450} animationOut="zoomOut" isVisible={this.state.filter} style={{ zIndex: 4, position: 'absolute' }}>
              <div style={{ zIndex: 2, backgroundColor: 'white', width: '30.5vw' }}>
                <MapFilterComponent
                  loadDataJson={this.loadDataJson.bind(this)}
                  loadPersonNames={this.loadPersonNames.bind(this)}
                  loadDateValues={this.loadDateValues.bind(this)}
                  DataVuzix={this.state.DataVuzix}
                  video={this.state.video}
                />
              </div>
            </Animated> :<div></div>}
            <MapComponent markersMap={this.state.DataVuzix} loadDataJson={this.loadDataJson.bind(this)} />
          </>
        }
      </>
    )
  }
}


export default App;