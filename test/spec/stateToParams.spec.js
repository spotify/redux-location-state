import {stateToParams} from '../../src/stateToParams';
import {expect} from 'chai';
import {cloneDeep} from 'lodash';
import {beforeEach} from 'mocha';

const configPaths = {
  '/': {
    foo: {stateKey: 'count'}
  },
  '/otherpath/*': {
    bazz: {stateKey: 'other', type: 'array'},
    bar: {stateKey: 'yeah.itIsHere', type: 'object', options: {isFlags: true}},
    time: {stateKey: 'itIsTime', type: 'date'}
  },
  '/withshouldpush': {
    toon: {stateKey: 'test', options: {shouldPush: true}}
  }
}

describe('createObjectFromConfig function', () => {
  let location;
  let result;
  beforeEach(() => {
    location = {
      pathname: '/',
    };
    result = {
      location: cloneDeep(location),
      shouldPush: false
    };
  })
  it('returns a location object with the shouldPush flag as true if a state with a shouldPush option has changed', () => {
    const currentState = {
      test: 'for sure',
    }
    location.pathname = '/withshouldpush';
    expect(stateToParams(configPaths, currentState, location).shouldPush).to.deep.equal(true);
  });
  it('returns a location object with the state mapped to the config paths in the query object', () => {
    const currentState = {
      count: 'yeah'
    }
    result.location.search = '?foo=yeah';
    expect(stateToParams(configPaths, currentState, location)).to.deep.equal(result);
  });
  it('returns a location object with the complex types state mapped to the config paths in the query object', () => {
    const currentState = {
      other: ['alex', 'marty', 'steve'],
      itIsTime : new Date(),
      yeah: {
        itIsHere: {
          foo: true,
          bazz: false,
          toon: true
        }
      }
    }
    location.pathname = result.location.pathname = '/otherpath/donezo';
    result.location.search = `?bazz=alex-marty-steve&bar=foo-toon&time=${new Date().toISOString().substring(0, 10)}`;
    expect(stateToParams(configPaths, currentState, location)).to.deep.equal(result);
  });
});