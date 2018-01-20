import { expect } from 'chai';
import { PathHelpers } from './path-helpers';

describe('PathHelpers', () => {

  describe('removeExtension', () => {
    it('should work correct', () => {
      expect(PathHelpers.removeExtension('file.ext')).equal('file');
      expect(PathHelpers.removeExtension('file.ext.ext')).equal('file.ext');
      expect(PathHelpers.removeExtension('/path/file.ext.ext')).equal('/path/file.ext');
    });
  });

  describe('getExtension', () => {
    it('should work correct', () => {
      expect(PathHelpers.getExtension('file.ext')).equal('ext');
      expect(PathHelpers.getExtension('file.ext.ext')).equal('ext');
      expect(PathHelpers.getExtension('/path/file.ext.ext')).equal('ext');
    });
  });

});
