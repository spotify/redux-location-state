import compact from 'lodash/compact';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';


import {createReduxLocationActions} from '../../src/index';

import {mapLocationToState, paramSetup} from './location';


export default function createAppStore(reducer, history) {
  const loggerMiddleware = createLogger({collapsed: true});
  const {locationMiddleware, reducersWithLocation} = createReduxLocationActions(paramSetup, mapLocationToState, history, reducer);

  const middleware = compact([
    // thunk middleware, allows actions to return 'thunk' functions
    thunkMiddleware,
    // location middleware, updates location via replaceState when app state changes
    locationMiddleware,
    // logger middleware, logs all actions to the console (optional)
    loggerMiddleware
  ]);
  
  return createStore(reducersWithLocation, applyMiddleware(...middleware))
}
