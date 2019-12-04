'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseQuery = parseQuery;

var _helpers = require('./helpers');

var _typeHandles = require('./typeHandles');

function parseQuery(initialState, location) {
  var pathConfig = (0, _helpers.createObjectFromConfig)(initialState, location);
  var customParser = initialState[_helpers.RLSCONFIG] && initialState[_helpers.RLSCONFIG].queryParser;
  var query = (0, _helpers.parseParams)(location.search, customParser);
  if (!pathConfig) {
    return location.search;
  }

  //return a new object parsed from the QP
  return Object.keys(pathConfig).reduce(function (prev, curr) {
    var _pathConfig$curr = pathConfig[curr],
        stateKey = _pathConfig$curr.stateKey,
        _pathConfig$curr$opti = _pathConfig$curr.options,
        options = _pathConfig$curr$opti === undefined ? {} : _pathConfig$curr$opti,
        initialValue = _pathConfig$curr.initialState,
        type = _pathConfig$curr.type;

    var paramValue = query[curr];
    var finalValue = void 0;
    if (typeof paramValue === 'undefined' || paramValue === null) {
      // if the initial value is an empty object or array and not specifically set to use as an empty item set as undefined
      (0, _helpers.set)(prev, stateKey, initialValue);
      return prev;
    }

    //allow a user to pass in a custom parser
    if (options.parse) {
      finalValue = options.parse(paramValue);
    } else if (type) {
      finalValue = _typeHandles.typeHandles[type].parse(paramValue, options);
    } else {
      finalValue = paramValue;
    }
    (0, _helpers.set)(prev, stateKey, finalValue);
    return prev;
  }, {});
}