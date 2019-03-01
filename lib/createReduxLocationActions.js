'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReduxLocationActions = createReduxLocationActions;

var _constants = require('./constants');

var _helpers = require('./helpers');

var _parseQuery = require('./parseQuery');

var _stateToParams = require('./stateToParams');

function createReduxLocationActions(setupObject, locationToStateReducer, history, appReducer) {
  var stateToParamsFinal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _stateToParams.stateToParams;

  // Some Redux libraries need specific accessor functions and can't use lodash.
  // This gives the opportunity to overwrite the accessor function
  if (setupObject[_helpers.RLSCONFIG] && setupObject[_helpers.RLSCONFIG][_helpers.OVERWRITE_ACCESSORS]) {
    Object.keys(setupObject[_helpers.RLSCONFIG][_helpers.OVERWRITE_ACCESSORS]).forEach(function (key) {
      (0, _helpers.overrideAccessors)(key, setupObject[_helpers.RLSCONFIG][_helpers.OVERWRITE_ACCESSORS][key]);
    });
  }

  var previousLocation = {};

  return {
    // returns middleware that a user will install in their middleware array
    locationMiddleware: function locationMiddleware(store) {
      return function (next) {
        return function (action) {
          var state = store.getState();
          var result = next(action);

          // if store state changed, update the URL via history.replace
          var nextState = store.getState();
          var location = history.location;
          //if the url changes but not the store the new url will not get the new params
          var isPageDifferent = location.pathname !== previousLocation.pathname;
          if (nextState !== state || isPageDifferent) {
            previousLocation = location;
            var nextLocationOptions = stateToParamsFinal(setupObject, nextState, location);
            // assign shouldPush to a new variable and erase shouldPush as it isn't a standard
            // part of a location object. if shouldPush does not exist this is non-destructive
            var shouldPush = nextLocationOptions.shouldPush,
                nextLocation = nextLocationOptions.location;

            if (!(0, _helpers.isEqual)(nextLocation, location)) {
              // grab shouldPush from newly built location to see if it should update
              shouldPush && !isPageDifferent ? history.push(nextLocation) : history.replace(nextLocation);
            }
          }

          return result;
        };
      };
    },
    // and IIFE that returns a new function that can be passed in as the reducer function
    reducersWithLocation: function () {
      var locationReducer = function locationReducer(state, action) {
        var type = action.type,
            payload = action.payload;

        if (!payload) {
          return state;
        }
        if (_constants.LOCATION_POP === type) {
          payload.query = (0, _parseQuery.parseQuery)(setupObject, payload);
          return payload ? locationToStateReducer(state, payload) : state;
        }
        return state;
      };

      return function combinedReducer(state, action) {
        var postReducerState = appReducer(state, action);
        var postLocationState = locationReducer(postReducerState, action);
        var hasChanged = postLocationState !== state;
        return hasChanged ? postLocationState : state;
      };
    }()
  };
}