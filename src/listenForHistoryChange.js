import { LOCATION_POP, LOCATION_PUSH } from './constants';

export function listenForHistoryChange(store, history) {
  const popDispatchFunction = (location) => {
    return {
      type: LOCATION_POP,
      payload: location
    };
  };
  const pushDispatchFunction = (location) => {
    return {
      type: LOCATION_PUSH,
      payload: location
    };
  };
  history.listen(() => {
    if (history && history.action) {

      if (history.action === 'POP') {
        store.dispatch(popDispatchFunction(history.location));

      } else if (history.action === 'PUSH') {
        //fire an empty dipatch to run the store functions
        store.dispatch(pushDispatchFunction(history.location));
        
      }
    }
  });

  // run on instantiation
  store.dispatch(popDispatchFunction(history.location));
}
