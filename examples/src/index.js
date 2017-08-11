import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import './styles/main.less';

import createAppStore from './store';
import reducer from './reducers';

import {listenForHistoryChange} from '../../src/index';

import App from './components/App';
import CounterPage from './components/CounterPage';
import OtherPage from './components/OtherPage';


/* MAIN APP ENTRY POINT */

// create the store which will be used for all app state
const history = createBrowserHistory();
const store = createAppStore(reducer, history);

// bind history events to call location actions on history pop, push & replace
listenForHistoryChange(store, history);

const app = (
  <Provider {...{store}}>
    <Router {...{history: history}}>
    <App>
      <Route exact path="/" component={CounterPage} />
      <Route path="/other" component={OtherPage}/>
    </App>
    </Router>
  </Provider>
);

const container = document.getElementById('container');
ReactDOM.render(app, container);
