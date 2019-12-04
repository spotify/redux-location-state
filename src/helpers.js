import lodashGet from 'lodash/get';
import lodashIsEqual from 'lodash/isEqual';
import lodashSet from 'lodash/set';

export const RLSCONFIG = 'RLSCONFIG';
export const OVERWRITE_ACCESSORS = 'overwrite-accessors';

const helperAccessors = {
  get: lodashGet,
  set: lodashSet,
  isEqual: lodashIsEqual,
};

let paramEncoder = encodeURIComponent;
export let paramDecoder = decodeURIComponent;
export function setParamEncoder(encoder) {
  paramEncoder = encoder;
}
export function setParamDecoder(decoder) {
  paramDecoder = decoder;
}

// Some Redux libraries need specific accessor functions and can't use lodash.
// This gives the opportunity to overwrite the accessor function
export function overrideAccessors(name, fn) {
  helperAccessors[name] = fn;
}

export function get(...args) {
  return helperAccessors.get(...args);
}

export function set(...args) {
  return helperAccessors.set(...args);
}

export function isEqual(...args) {
  return helperAccessors.isEqual(...args);
}


function isNotDefined(value) {
  return typeof value === 'undefined' || value === null;
}

export function getMatchingDeclaredPath(initialState, location) {
  const allPathItems = location.pathname.split('/');
  const initialStateKeys = Object.keys(initialState);
  //find the matched object
  const matchedItem = initialStateKeys.filter((item) => {
    // make a copy to match against
    const pathToMatchAgainst = [...allPathItems];
    // take declared path and split
    const initialDeclareditemSplit = item.split('/');
    // make a copy to destroy
    const reducedInitialItem = [...initialDeclareditemSplit];
    let deleted = 0;
    //destructive, but since its in a filter it should be fine
    initialDeclareditemSplit.forEach((split, index) => {
      //if the item has a * remove that query from both the match and the item to match
      if (split === '*') {
        pathToMatchAgainst.splice(index - deleted, 1);
        reducedInitialItem.splice(index - deleted, 1);
        deleted++;
      }
    });
    // match the final strings sans wildcards against each other
    return (pathToMatchAgainst.join('/')) === (reducedInitialItem.join('/'));
  });
  return matchedItem[0];
}

export function createObjectFromConfig(initialState, location) {
  if (!initialState) {return;}
  const declaredPath = getMatchingDeclaredPath(initialState, location);
  return initialState.global ?
    Object.assign({}, initialState.global, (initialState[declaredPath] || {})) :
    initialState[declaredPath];
}

export function getPath() {
  // borrowed from `history` internals
  // We can't use window.location.hash here - inconsistent across browsers
  const href = window.location.href;
  const indexAfterHash = href.indexOf('#') + 1;

  // check if there is a hash and if there's a url path after the hash
  if (indexAfterHash && href.substring(indexAfterHash).indexOf('/') === 0) {
    return href.substring(indexAfterHash);
  }

  // if reached, assume browserHistory and combine the url
  return window.location.pathname + window.location.search + window.location.hash;
}

export function createParamsString(qp) {
  const paramArray = Object.keys(qp).reduce((prev, key) => {
    const keyString = key.toString();
    const valueString = qp[key].toString();
    if (isNotDefined(valueString) || (Array.isArray(valueString) && !valueString.length)) {
      return prev;
    }
    return [...prev, (`${paramEncoder(keyString)}=${paramEncoder(valueString)}`)];
  }, []);

  return paramArray.length ? `?${paramArray.join('&')}` : '';
}

export function parseParams(query, customParser) {
    return (query && query.split('&').reduce((prev, queryparam) => {
      if (queryparam[0] === '?') {
        queryparam = queryparam.substr(1);
      }
      const split = customParser ? customParser(queryparam) : queryparam.split('=');
      prev[paramDecoder(split[0])] = paramDecoder(split[1]) || '';
      return prev;
    }, {})) || {};
  }

