import createBrowserHistory from 'history/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { listenForHistoryChange } from '../../src/index';
import App from './components/App';
import CounterPage from './components/CounterPage';
import OtherPage from './components/OtherPage';
import reducer from './reducers';
import createAppStore from './store';
import './styles/main.less';

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
      <Route exact path="/redux-location-state/" component={CounterPage} />
      <Route path="/redux-location-state/other" component={OtherPage}/>
    </App>
    </Router>
  </Provider>
);

const container = document.getElementById('container');
ReactDOM.render(app, container);
