import {LOCATION_POP, LOCATION_PUSH} from './constants';

export function listenForHistoryChange(store, history) {
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
  history.listen(() => {
    if (history && history.action && history.action === 'POP') {
      store.dispatch(popDispatchFunction(history.location));
    }
  });
  history.listen(() => {
    if (history && history.action && history.action === 'PUSH') {
      //fire an empty dipatch to run the store functions
      store.dispatch(pushDispatchFunction());
    }
  });

  // run on instantiation
  store.dispatch(popDispatchFunction(history.location));
}
