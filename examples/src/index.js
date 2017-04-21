import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import './styles/main.less';

import createAppStore from './store';
import reducer from './reducers';

import {listenForHistoryChange} from '../../src/index';

import App from './components/App';
import CounterPage from './components/CounterPage';
import OtherPage from './components/OtherPage';


/* MAIN APP ENTRY POINT */

// create the store which will be used for all app state
const store = createAppStore(reducer, hashHistory);

// bind history events to call location actions on history pop, push & replace
listenForHistoryChange(hashHistory, store);

const app = (
  <Provider {...{store}}>
    <Router {...{history: hashHistory}}>
      <Route name="app" path="/" component={App}>
        <IndexRoute component={CounterPage}/>
        <Route path="other" component={OtherPage}/>
      </Route>
    </Router>
  </Provider>
);

const container = document.getElementById('container');
ReactDOM.render(app, container);
