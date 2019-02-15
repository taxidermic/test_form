
import React, { Component } from 'react'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MainScreen from './src'

import reducer from './reducer';

const store = createStore(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <MainScreen />
      </Provider>
    );
  }
}