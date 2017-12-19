import { expect } from 'chai';
import { sortObject } from './object-helpers';

describe('Object helpers', () => {
  describe('sortObject', () => {
    it('should work correct', () => {
      expect(JSON.stringify(sortObject({c: 1, b: 2, d: null, a: [3, 1, 2]}))).equal('{"a":[3,1,2],"b":2,"c":1,"d":null}');
      expect(JSON.stringify(sortObject({c: 1, b: 2, a: {c: 1, b: {c: 1, b: 2}}}))).equal('{"a":{"b":{"b":2,"c":1},"c":1},"b":2,"c":1}');
    });
  });
});
