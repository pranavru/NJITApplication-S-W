import React from 'react';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import MainComponent from './components/MainComponent/MainComponent';
import { NavBarComponent } from './components/NavBarComponent/NavBarComponent';
import FeedBackComponent from './components/FeedBackComponent/FeedBackComponent';


const store = ConfigureStore();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <NavBarComponent />
          <Switch>
            <Route path="/home" component={MainComponent} />
            <Route path="/feedback" component={FeedBackComponent} />
            <Route path="/" component={MainComponent} />
            <Redirect to='/home' />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;