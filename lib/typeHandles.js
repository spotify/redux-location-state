'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeHandles = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _constants = require('./constants');

var _helpers = require('./helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var typeHandles = exports.typeHandles = {
  number: {
    serialize: function serialize(paramValue, options) {
      return paramValue.toString();
    },
    parse: function parse(paramValue, options) {
      return parseFloat(paramValue);
    }
  },
  date: {
    serialize: function serialize(paramValue, options) {
      return paramValue.toISOString().substring(0, 10);
    },
    parse: function parse(paramValue, options) {
      return new Date(paramValue);
    }
  },
  array: {
    serialize: function serialize(paramValue, options) {
      return (options.keepOrder ? [].concat(_toConsumableArray(paramValue)) : [].concat(_toConsumableArray(paramValue)).sort()).join(options.delimiter || _constants.OBJECT_KEY_DELIMITER);
    },
    parse: function parse(paramValue, options) {
      return (0, _helpers.paramDecoder)(paramValue).split(options.delimiter || _constants.OBJECT_KEY_DELIMITER);
    }
  },
  bool: {
    serialize: function serialize(paramValue, options) {
      return paramValue.toString();
    },
    parse: function parse(paramValue, options) {
      return paramValue === 'true';
    }
  },
  object: {
    serialize: function serialize(paramValue, options) {
      if (options.isFlags) {
        return Object.keys(paramValue).filter(function (item, index) {
          return paramValue[item];
        }).join(_constants.OBJECT_KEY_DELIMITER);
      } else {
        return Object.keys(paramValue).sort().map(function (item, index) {
          return '' + item + _constants.OBJECT_KEY_DELIMITER + paramValue[item];
        });
      }
    },
    parse: function parse(paramValue, options) {
      if (options.isFlags) {
        var objectSplit = paramValue.split(options.delimiter || _constants.OBJECT_KEY_DELIMITER);
        return objectSplit.reduce(function (prev, curr) {
          if (curr === '') {
            return prev;
          }
          prev[curr] = true;
          return prev;
        }, {});

        // otherwise parse the object
      } else {
        var allObjectValues = (0, _helpers.paramDecoder)(paramValue).split(',');
        // since it was serialized as an array, split by comma and check to see if there are simple values
        return allObjectValues.reduce(function (prev, curr) {
          var _curr$split = curr.split(_constants.OBJECT_KEY_DELIMITER),
              _curr$split2 = _slicedToArray(_curr$split, 2),
              key = _curr$split2[0],
              value = _curr$split2[1];

          prev[key] = value;
          return prev;
        }, {});
      }
    }
  }
};