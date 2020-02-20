'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paramDecoder = exports.OVERWRITE_ACCESSORS = exports.RLSCONFIG = undefined;
exports.setParamEncoder = setParamEncoder;
exports.setParamDecoder = setParamDecoder;
exports.overrideAccessors = overrideAccessors;
exports.get = get;
exports.set = set;
exports.isEqual = isEqual;
exports.getMatchingDeclaredPath = getMatchingDeclaredPath;
exports.createObjectFromConfig = createObjectFromConfig;
exports.getPath = getPath;
exports.createParamsString = createParamsString;
exports.parseParams = parseParams;

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var RLSCONFIG = exports.RLSCONFIG = 'RLSCONFIG';
var OVERWRITE_ACCESSORS = exports.OVERWRITE_ACCESSORS = 'overwrite-accessors';

var helperAccessors = {
  get: _get2.default,
  set: _set2.default,
  isEqual: _isEqual2.default
};

var paramEncoder = encodeURIComponent;
var paramDecoder = exports.paramDecoder = decodeURIComponent;
function setParamEncoder(encoder) {
  paramEncoder = encoder;
}
function setParamDecoder(decoder) {
  exports.paramDecoder = paramDecoder = decoder;
}

// Some Redux libraries need specific accessor functions and can't use lodash.
// This gives the opportunity to overwrite the accessor function
function overrideAccessors(name, fn) {
  helperAccessors[name] = fn;
}

function get() {
  return helperAccessors.get.apply(helperAccessors, arguments);
}

function set() {
  return helperAccessors.set.apply(helperAccessors, arguments);
}

function isEqual() {
  return helperAccessors.isEqual.apply(helperAccessors, arguments);
}

function isNotDefined(value) {
  return typeof value === 'undefined' || value === null;
}

function getMatchingDeclaredPath(initialState, location) {
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
    var deleted = 0;
    //destructive, but since its in a filter it should be fine
    initialDeclareditemSplit.forEach(function (split, index) {
      //if the item has a * remove that query from both the match and the item to match
      if (split === '*') {
        pathToMatchAgainst.splice(index - deleted, 1);
        reducedInitialItem.splice(index - deleted, 1);
        deleted++;
      }
    });
    // match the final strings sans wildcards against each other
    return pathToMatchAgainst.join('/') === reducedInitialItem.join('/');
  });
  return matchedItem[0];
}

function createObjectFromConfig(initialState, location) {
  if (!initialState) {
    return;
  }
  var declaredPath = getMatchingDeclaredPath(initialState, location);
  return initialState.global ? Object.assign({}, initialState.global, initialState[declaredPath] || {}) : initialState[declaredPath];
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

function createParamsString(qp) {
  var paramArray = Object.keys(qp).reduce(function (prev, key) {
    var keyString = key.toString();
    var value = qp[key];
    if (isNotDefined(value) || Array.isArray(value) && !value.length) {
      return prev;
    }
    var valueString = qp[key].toString();
    return [].concat(_toConsumableArray(prev), [paramEncoder(keyString) + '=' + paramEncoder(valueString)]);
  }, []);

  return paramArray.length ? '?' + paramArray.join('&') : '';
}

function parseParams(query, customParser) {
  return query && query.split('&').reduce(function (prev, queryparam) {
    if (queryparam[0] === '?') {
      queryparam = queryparam.substr(1);
    }
    var split = customParser ? customParser(queryparam) : queryparam.split('=');
    prev[paramDecoder(split[0])] = paramDecoder(split[1]) || '';
    return prev;
  }, {}) || {};
}