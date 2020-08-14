import React from 'react';
import MainComponent from './components/MainComponent/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import SimpleReactLightbox from 'simple-react-lightbox'

const store = ConfigureStore();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <MainComponent />
      </Provider>
    </div>
  );
}

export default App;