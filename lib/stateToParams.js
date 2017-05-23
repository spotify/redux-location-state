'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.stateToParams = stateToParams;

var _helpers = require('./helpers');

var _constants = require('./constants');

var _typeHandles = require('./typeHandles');

function stateToParams(initialState, currentState, location) {
  var pathConfig = (0, _helpers.createObjectFromConfig)(initialState, location);
  if (!pathConfig) {
    return { location: _extends({}, location) };
  }
  var shouldPush = false;
  //check the original config for values
  var newQueryParams = Object.keys(pathConfig).reduce(function (prev, curr) {
    var _pathConfig$curr = pathConfig[curr],
        stateKey = _pathConfig$curr.stateKey,
        _pathConfig$curr$opti = _pathConfig$curr.options,
        options = _pathConfig$curr$opti === undefined ? {} : _pathConfig$curr$opti,
        initialValue = _pathConfig$curr.initialState,
        type = _pathConfig$curr.type;

    var currentItemState = (0, _helpers.get)(currentState, stateKey, initialValue);
    var isDefault = void 0;
    //check if the date is the same as the one in initial value
    if (type === 'date') {
      isDefault = currentItemState.toISOString().substring(0, 10) === (initialValue && initialValue.toISOString().substring(0, 10));
    } else {
      //if an empty object, make currentItemState undefined
      if (currentItemState && (typeof currentItemState === 'undefined' ? 'undefined' : _typeof(currentItemState)) === 'object' && !Object.keys(currentItemState).length) {
        currentItemState = undefined;
      }
      // check if the item is default
      isDefault = (typeof currentItemState === 'undefined' ? 'undefined' : _typeof(currentItemState)) === 'object' ? (0, _helpers.isEqual)(initialValue, currentItemState) : currentItemState === initialValue;
    }
    // if it is default or doesn't exist don't make a query parameter
    if ((!currentItemState || isDefault) && !options.setAsEmptyItem) {
      return prev;
    }
    // otherwise, check if there is a serialize function
    if (options.serialize) {
      currentItemState = options.serialize(currentItemState);
    } else if (type) {
      currentItemState = _typeHandles.typeHandles[type].serialize(currentItemState, options);
    }
    // add new params to reduced object
    prev[encodeURIComponent(curr)] = encodeURIComponent(currentItemState);
    //check if a shouldPush property has changed
    if (encodeURIComponent(currentItemState) !== location.query[encodeURIComponent(curr)] && options.shouldPush) {
      shouldPush = true;
    }
    return prev;
  }, {});
  return { location: _extends({}, location, { query: newQueryParams }), shouldPush: shouldPush };
}