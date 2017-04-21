import {parseQuery} from '../../src/parseQuery';
import {expect} from 'chai';
import {beforeEach} from 'mocha';

describe('parseQuery function', () => {
  let configPaths;
  beforeEach(() => {
    configPaths = {
      '/': {
        foo: {stateKey: 'count', type: 'object'}
      },
      '/otherpath/*': {
        bazz: {stateKey: 'other'}
      }
    }
  });
  it('returns a map of the stateKeys with the values that are a query parameter', () => {
    const location = {
      query: {
        bazz: 25
      },
      pathname: '/otherpath/something',
    };
    expect(parseQuery(configPaths, location)).to.deep.equal({other: 25});
  });
  it('returns an undefined key undefined if the initialState on a value is an empty object', () => {
    const location = {
      query: {
      },
      pathname: '/',
    };
    expect(parseQuery(configPaths, location)).to.deep.equal({count: undefined});
  });
  it('returns an empty object if the option of setAsEmptyItem is true and the value is an empty object', () => {
    const location = {
      query: {
      },
      pathname: '/',
    };
    configPaths['/'].foo.initialState = {};
    expect(parseQuery(configPaths, location)).to.deep.equal({count: {}});
  });
});
