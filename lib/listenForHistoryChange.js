'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenForHistoryChange = listenForHistoryChange;

var _constants = require('./constants');

function listenForHistoryChange(store, history) {
  var popDispatchFunction = function popDispatchFunction(location) {
    return {
      type: _constants.LOCATION_POP,
      payload: location
    };
  };
  var pushDispatchFunction = function pushDispatchFunction() {
    return {
      type: _constants.LOCATION_PUSH,
      payload: {}
    };
  };
  history.listen(function () {
    if (history && history.action && history.action === 'POP') {
      store.dispatch(popDispatchFunction(history.location));
    }
  });
  history.listen(function () {
    if (history && history.action && history.action === 'PUSH') {
      //fire an empty dipatch to run the store functions
      store.dispatch(pushDispatchFunction());
    }
  });

  // run on instantiation
  store.dispatch(popDispatchFunction(history.location));
}