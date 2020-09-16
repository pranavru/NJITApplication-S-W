import React from 'react';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainComponent from './components/MainComponent/MainComponent';
import { NavBarComponent } from '../src/components/MainComponent/NavBarComponent';

const store = ConfigureStore();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router basename="http://localhost:3000/" >
          <NavBarComponent />
          <Switch>
            <Route path="/home">
              <MainComponent />
            </Route>
            <Route path="/feedback">
              <div style={{ display: 'flex' }}>Hello, feedback</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;