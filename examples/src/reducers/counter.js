import { ACTIONS, INITIAL_STATE } from '../constants.js';

export default function counterReducer(state = INITIAL_STATE, action) {
  const {type, payload} = action;
  switch(type) {
    case ACTIONS.INCREMENT_COUNTER:
      return Object.assign({}, state, {
        count: state.count + payload.amount
      });

    case ACTIONS.DECREMENT_COUNTER:
      return Object.assign({}, state, {
        count: state.count - payload.amount
      });

    default:
      return state;
  }
}
