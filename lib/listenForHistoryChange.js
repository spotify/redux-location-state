'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenForHistoryChange = listenForHistoryChange;

var _constants = require('./constants');

var _helpers = require('./helpers');

function listenForHistoryChange(history, store) {
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
  history.listen(function (location) {
    if (location && location.action && location.action === 'POP') {
      store.dispatch(popDispatchFunction((0, _helpers.getCurrentLocation)(history)));
    }
  });
  history.listen(function (location) {
    if (location && location.action && location.action === 'PUSH') {
      //fire an empty dipatch to run the store functions
      store.dispatch(pushDispatchFunction());
    }
  });
}