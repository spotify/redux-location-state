import {LOCATION_POP, LOCATION_PUSH} from './constants';
import {getCurrentLocation} from './helpers';

export function listenForHistoryChange(history, store) {
  const popDispatchFunction = (location) => {
    return {
      type: LOCATION_POP,
      payload: location
    };
  };
  const pushDispatchFunction = () => {
    return {
      type: LOCATION_PUSH,
      payload: {}
    };
  };
  history.listen((location) => {
    if (location && location.action && location.action === 'POP') {
      store.dispatch(popDispatchFunction(getCurrentLocation(history)));
    }
  });
  history.listen((location) => {
    if (location && location.action && location.action === 'PUSH') {
      //fire an empty dipatch to run the store functions
      store.dispatch(pushDispatchFunction());
    }
  });
}
