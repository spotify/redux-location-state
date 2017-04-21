import {parseQuery} from './parseQuery';
import {LOCATION_POP} from './constants';
import {getCurrentLocation, isEqual} from './helpers';
import {stateToParams} from './stateToParams';

export function createReduxLocationActions(setupObject, locationToStateReducer, history, appReducer, stateToParamsFinal = stateToParams) {
  let previousLocation = {};
  return {
    // returns middleware that a user will install in their middleware array
    locationMiddleware: function locationMiddleware(store) {
      return next => action => {
        const state = store.getState();
        const result = next(action);

        // if store state changed, update the URL via history.replace
        const nextState = store.getState();
        const location = getCurrentLocation(history);
        //if the url changes but not the store the new url will not get the new params
        const isPageDifferent = location.pathname !== previousLocation.pathname;
        if (nextState !== state || isPageDifferent) {
          previousLocation = location;
          const nextLocationOptions = stateToParamsFinal(setupObject, nextState, location);
          // assign shouldPush to a new variable and erase shouldPush as it isn't a standard
          // part of a location object. if shouldPush does not exist this is non-destructive
          const {shouldPush, location: nextLocation} = nextLocationOptions;

          if (!isEqual(nextLocation, location)) {
            // grab shouldPush from newly built location to see if it should update
            (shouldPush && !isPageDifferent) ? history.push(nextLocation) : history.replace(nextLocation);
          }
        }

        return result;
      };
    },
    // and IIFE that returns a new function that can be passed in as the reducer function
    reducersWithLocation: (() => {
      const locationReducer = (state, action) => {
        const {type, payload} = action;
        if (!payload) {return state;}
        if (LOCATION_POP === type) {
          if (payload.query) {
            payload.query = parseQuery(setupObject, payload);
          }
          return payload ? Object.assign({}, locationToStateReducer(state, payload)) : state;
        }
        return state;
      };

      return function combinedReducer(state, action) {
        const postReducerState = appReducer(state, action);
        const postLocationState = locationReducer(postReducerState, action);
        const hasChanged = postLocationState !== state;
        return hasChanged ? postLocationState : state;
      };
    })()
  };
}