import { expect } from 'chai';
import { createObjectFromConfig, getOriginalDate } from '../../src/helpers';

const configPaths = {
  '/': {
    foo: {stateKey: 'count'}
  },
  '/otherpath/*': {
    bazz: {stateKey: 'other'}
  },
  '/any/*/between/*': {
    any: {stateKey: 'anything'}
  }
};

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
     const configPathsGlobal = {...configPaths, global: {globe: {stateKey: 'globalpath'}}};
     expect(createObjectFromConfig(configPathsGlobal, location)).to.deep.equal(
       {bazz: {stateKey: 'other'}, globe: {stateKey: 'globalpath'}}
     );
   });
   it('returns an object of the possible redux store items to map including several wildcards', () => {
     const location = {
       pathname: '/any/somepath/between/morepath',
     };
     expect(createObjectFromConfig(configPaths, location)).to.deep.equal({any: {stateKey: 'anything'}});
   });
   describe('getOriginalDate function', () => {
    it('returns undefined if parameter not exist', () => {
      expect(getOriginalDate()).to.equal(undefined);
    });
    it('returns an string containing day/month/year', () => {
      const firstDate = new Date('2017-08-15 00:00:00 EST');
      expect(getOriginalDate(firstDate)).to.equal('15/8/2017');
      expect(typeof firstDate).to.be.a('string');
      
      const secondDate = new Date('July 22, 2018 07:22:13')
      expect(getOriginalDate(secondDate)).to.equal('22/7/2018');
      expect(typeof secondDate).to.be.a('string');

      const thirdDate = new Date('December 31, 2020')
      expect(getOriginalDate(thirdDate)).to.equal('31/12/2020');
      expect(typeof thirdDate).to.be.a('string');
    });
   });
 });
});
