import _ from 'lodash';
import { INITIAL_STATE } from './constants';

// this file exports two functions, which are the 'bridge' between the URL and app state:

// mapLocationToState takes location object and app state,
//   and returns new app state with location params merged into it

// mapStateToLocation takes app state and location,
//   and returns new location updated from app state

// functions necessary for parsing the URL parameters (eg. dates, numbers) can be implemented in here,
// or if more complicated, can be specified more rigidly somewhere else and called here


export function mapLocationToState(state, location) {
  switch(location.pathname) {
    
    case "/":
      const stateFromLocation = location.query;
      return _.merge({}, state, stateFromLocation);

    default:
      return state;
  }
}


// this is just a rough sketch of possible transformers.
// real ones could be much bigger or smarter,
// and could use schemas or constants files more effectively,
// but the point is having one location where this happens

export const paramSetup = {
  global: {
     count: {stateKey: 'count', type: 'number', options: {shouldPush: true}, initialState: INITIAL_STATE.count}
  }
};