import {typeHandles} from '../../src/typeHandles';
import {expect} from 'chai';
import {OBJECT_KEY_DELIMITER} from '../../src/constants';

describe('typeHandles functions', () => {

 describe('date functions', () => {
   const {date} = typeHandles;
   const dateTime = new Date();
    it('should return the same thing if recursively called', () => {
       //going to substring it to utc time at a greater number to offset for the milliseconds between function calls
     expect(date.parse(date.serialize(dateTime)).getTime().toString().substring(0, 10)).to.deep.equal(new Date(dateTime.toISOString().substring(0, 10)).getTime().toString().substring(0, 10));
   });
   it('should parse a date string back to a new date', () => {
     //going to substring it to utc time at a greater number to offset for the milliseconds between function calls
     expect(date.parse(dateTime.toISOString().substring(0, 10)).getTime().toString().substring(0, 10)).to.deep.equal(new Date(dateTime.toISOString().substring(0, 10)).getTime().toString().substring(0, 10));
   });
   it('should return a date string back', () => {
     expect(date.serialize(dateTime)).to.deep.equal(dateTime.toISOString().substring(0, 10));
   });
 });

 describe('array functions', () => {
   const {array} = typeHandles;
   const testArray = ['something', 'something else', 'alvin'];

   it('should return the same thing if recursively called', () => {
     expect(array.parse(array.serialize(testArray, {keepOrder: true}), {})).to.deep.equal(testArray);
   });
   it('should parse an array and return a joined string', () => {
     expect(array.parse(testArray.join(OBJECT_KEY_DELIMITER), {})).to.deep.equal(testArray);
   });
   it('should return a serialized array back', () => {
     expect(array.serialize(testArray, {})).to.equal(testArray.sort().join(OBJECT_KEY_DELIMITER));
   });
   it('should return a serialized array back with a customized delimiter', () => {
     const delimiter = 'SPOTIFY';
     expect(array.serialize(testArray, {delimiter})).to.equal(testArray.sort().join(delimiter));
   });
   it('should return a serialized array back with the same order', () => {
     expect(array.serialize(testArray, {keepOrder: true})).to.equal(testArray.join(OBJECT_KEY_DELIMITER));
   });
 });

 describe('object functions', () => {
   const {object} = typeHandles;
   const testObject = {
     key: 'true',
     test: 'yes',
   };
  const flagObject = {
      boo: true,
      fizz: false,
      buzz: true
    }
   const objectString = Object.keys(testObject).reduce((prev, curr) => {
       return [...prev, `${curr}${OBJECT_KEY_DELIMITER}${testObject[curr]}`]
     }, []);

   it('should return the same thing if recursively called', () => {
     expect(object.parse(object.serialize(testObject, {}), {})).to.deep.equal(testObject);
   });
   it('should parse a string and return an object', () => {
     expect(object.parse(objectString.join(','), {})).to.deep.equal(testObject);
   });
   it('should serialize an object and return a joined string', () => {
     expect(object.serialize(testObject, {})).to.deep.equal(objectString);
   });
  it('should serialize an object and return a joined string of only keys', () => {
     expect(object.serialize(flagObject, {isFlags: true})).to.equal('boo-buzz');
   });
   it('should parse an object and return a object of true keys', () => {
     expect(object.parse('boo-buzz', {isFlags: true})).to.deep.equal({boo: true, buzz: true});
   });
   it('should return a serialized object with a customized delimiter', () => {
     const delimiter = '|';
     expect(object.serialize(testObject, {delimiter})).to.deep.equal([`key${delimiter}true`, `test${delimiter}yes`]);
   });
   it('should parse a string with a customized delimiter', () => {
     const delimiter = '|';
     expect(object.parse(`key${delimiter}value,foo${delimiter}bar`, {delimiter})).to.deep.equal({key: 'value', foo: 'bar'});
   });
   it('should return a serialized object with a customized delimiter in the flags mode', () => {
    const delimiter = '|';
    expect(object.serialize({foo: true, bar: true}, {delimiter, isFlags: true})).to.equal(`foo${delimiter}bar`);
   });
   it('should parse a string with a customized delimiter in the flags mode', () => {
    const delimiter = '|';
    expect(object.parse(`foo|bar`, {delimiter, isFlags: true})).to.deep.equal({foo: true, bar: true});
   });
 });
});
