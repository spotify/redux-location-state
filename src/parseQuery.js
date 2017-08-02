import {OBJECT_KEY_DELIMITER} from './constants';
import {set, createObjectFromConfig, parseParams} from './helpers';
import {typeHandles} from './typeHandles';

export function parseQuery(initialState, location) {
  const pathConfig = createObjectFromConfig(initialState, location);
  const query = parseParams(location.search);
  if (!pathConfig) {return location.search;}

  //return a new object parsed from the QP
  return Object.keys(pathConfig).reduce((prev, curr) => {
    const {stateKey, options = {}, initialState: initialValue, type} = pathConfig[curr];
    const paramValue = query[curr];
    let finalValue;
    if (typeof paramValue === 'undefined' || paramValue === null) {
      // if the initial value is an empty object or array and not specifically set to use as an empty item set as undefined
        set(prev, stateKey, initialValue);
      return prev;
    }

    //allow a user to pass in a custom parser
    if (options.parse) {
      finalValue = options.parse(paramValue);
    } else if (type) {
      finalValue = typeHandles[type].parse(paramValue, options);
    } else {
      finalValue = paramValue;
    }
    set(prev, stateKey, finalValue);
    return prev;
  }, {});
}
