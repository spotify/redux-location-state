'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentLocation = getCurrentLocation;
exports.createObjectFromConfig = createObjectFromConfig;
exports.getPath = getPath;

var _get = require('lodash/get');

Object.defineProperty(exports, 'get', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_get).default;
  }
});

var _set = require('lodash/set');

Object.defineProperty(exports, 'set', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_set).default;
  }
});

var _isEqual = require('lodash/isEqual');

Object.defineProperty(exports, 'isEqual', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isEqual).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getCurrentLocation(history) {
  // why doesn't hashHistory.createLocation(window.location) actually work...? who knows.
  var location = history.createLocation(getPath());
  // pull the "key" out of query._k and add it to location.key
  // i guess react-router does this part usually
  if (location && location.query && location.query._k) {
    location.key = location.query._k;
    delete location.query._k;
  }
  return location;
}

function createObjectFromConfig(initialState, location) {
  if (!initialState) {
    return;
  }
  var allPathItems = location.pathname.split('/');
  var initialStateKeys = Object.keys(initialState);
  //find the matched object
  var matchedItem = initialStateKeys.filter(function (item) {
    // make a copy to match against
    var pathToMatchAgainst = [].concat(_toConsumableArray(allPathItems));
    // take declared path and split
    var initialDeclareditemSplit = item.split('/');
    // make a copy to destroy
    var reducedInitialItem = [].concat(_toConsumableArray(initialDeclareditemSplit));
    //destructive, but since its in a filter it should be fine
    initialDeclareditemSplit.forEach(function (split, index) {
      //if the item has a * remove that query from both the match and the item to match
      if (split === '*') {
        pathToMatchAgainst.splice(index, 1);
        reducedInitialItem.splice(index, 1);
      }
    });
    // match the final strings sans wildcards against each other
    return pathToMatchAgainst.join('/') === reducedInitialItem.join('/');
  });
  var declaredPath = matchedItem[0];
  return initialState.global ? Object.assign(initialState.global, initialState[declaredPath] || {}) : initialState[declaredPath];
}

function getPath() {
  // borrowed from `history` internals
  // We can't use window.location.hash here - inconsistent across browsers
  var href = window.location.href;
  var indexAfterHash = href.indexOf('#') + 1;

  // check if there is a hash and if there's a url path after the hash
  if (indexAfterHash && href.substring(indexAfterHash).indexOf('/') === 0) {
    return href.substring(indexAfterHash);
  }

  // if reached, assume browserHistory and combine the url
  return window.location.pathname + window.location.search + window.location.hash;
}