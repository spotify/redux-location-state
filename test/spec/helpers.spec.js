import {isEmpty, createObjectFromConfig} from '../../src/helpers';
import {expect} from 'chai';

const configPaths = {
  '/': {
    foo: {stateKey: 'count'}
  },
  '/otherpath/*': {
    bazz: {stateKey: 'other'}
  }
}

describe('Helper functions', () => {
 describe('createObjectFromConfig function', () => {
   it('returns an object of the possible redux store items to map based on a location that is mapped', () => {
     const location = {
       pathname: '/',
     };
     expect(createObjectFromConfig(configPaths, location)).to.deep.equal({foo: {stateKey: 'count'}});
   });
   it('returns an object of the possible redux store items to map including a wildcard', () => {
     const location = {
       pathname: '/otherpath/spotify',
     };
     expect(createObjectFromConfig(configPaths, location)).to.deep.equal({bazz: {stateKey: 'other'}});
   });
   it('returns an object of the possible redux store items to map including a wildcard and global items', () => {
     const location = {
       pathname: '/otherpath/spotify',
     };
     configPaths.global = {
       globe: {stateKey: 'globalpath'}
     };
     expect(createObjectFromConfig(configPaths, location)).to.deep.equal({bazz: {stateKey: 'other'}, globe: {stateKey: 'globalpath'}});
   });
 });
});