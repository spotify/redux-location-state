import {OBJECT_KEY_DELIMITER} from './constants';

export const typeHandles = {
  number: {
    serialize(paramValue, options) { return paramValue.toString();},
    parse(paramValue, options) { return parseFloat(paramValue);}
  },
  date: {
    serialize(paramValue, options) { return paramValue.toISOString().substring(0, 10);},
    parse(paramValue, options) { return new Date(paramValue);}
  },
  array: {
    serialize(paramValue, options) {
      return (options.keepOrder ? [...paramValue] : [...paramValue].sort()).join(options.delimiter || OBJECT_KEY_DELIMITER);
    },
    parse(paramValue, options) {
      return decodeURIComponent(paramValue).split(options.delimiter || OBJECT_KEY_DELIMITER);
    }
  },
  bool: {
    serialize(paramValue, options) { return paramValue.toString();},
    parse(paramValue, options) { return paramValue === 'true';}
  },
  object: {
    serialize(paramValue, options) {
      if (options.isFlags) {
          return Object.keys(paramValue).filter((item, index) => paramValue[item]).join(OBJECT_KEY_DELIMITER);
        } else {
          return Object.keys(paramValue).sort().map((item, index) => `${item}${OBJECT_KEY_DELIMITER}${paramValue[item]}`);
        }
    },
    parse(paramValue, options) {
      if (options.isFlags) {
          const objectSplit = paramValue.split(options.delimiter || OBJECT_KEY_DELIMITER);
          return objectSplit.reduce((prev, curr) => {
            if(curr === '') {return prev;}
            prev[curr] = true;
            return prev;
          }, {});

        // otherwise parse the object
        } else {
          const allObjectValues = decodeURIComponent(paramValue).split(',');
          // since it was serialized as an array, split by comma and check to see if there are simple values
          return allObjectValues.reduce((prev, curr) => {
            let [key, value] = curr.split(OBJECT_KEY_DELIMITER);
            prev[key] = value;
            return prev;
          }, {});
        }
    }
  }
}