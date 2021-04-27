
import './App.css';
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Movies from './components/Movies';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import myMovieList from './reducer/myMovieList';
import page from './reducer/page'

const store = createStore(
  combineReducers({
    myMovieList,
    page
  })
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={Movies} path="/" exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
