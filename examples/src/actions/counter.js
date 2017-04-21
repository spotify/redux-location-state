import {ACTIONS} from '../constants';

export function increment(amount = 1) {
  return {
    type: ACTIONS.INCREMENT_COUNTER,
    payload: {amount}
  }
}

export function decrement(amount = 1) {
  return {
    type: ACTIONS.DECREMENT_COUNTER,
    payload: {amount}
  }
}
