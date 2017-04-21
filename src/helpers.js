export function getCurrentLocation(history) {
  // why doesn't hashHistory.createLocation(window.location) actually work...? who knows.
  const location = history.createLocation(getPath());
  // pull the "key" out of query._k and add it to location.key
  // i guess react-router does this part usually
  if (location && location.query && location.query._k) {
    location.key = location.query._k;
    delete location.query._k;
  }
  return location;
}

export function createObjectFromConfig(initialState, location) {
  if (!initialState) {return;}
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
    //destructive, but since its in a filter it should be fine
    initialDeclareditemSplit.forEach((split, index) => {
      //if the item has a * remove that query from both the match and the item to match
      if (split === '*') {
        pathToMatchAgainst.splice(index, 1);
        reducedInitialItem.splice(index, 1);
      }
    });
    // match the final strings sans wildcards against each other
    return (pathToMatchAgainst.join('/')) === (reducedInitialItem.join('/'));
  });
  const declaredPath = matchedItem[0];
  return initialState.global ? Object.assign(initialState.global, (initialState[declaredPath] || {})) : initialState[declaredPath];
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

export {default as get} from 'lodash/get';
export {default as set} from 'lodash/set';
export {default as isEqual} from 'lodash/isEqual';
