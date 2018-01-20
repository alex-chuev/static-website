import { expect } from 'chai';
import { AppConfig } from '../app/app-config';
import { FileObject } from '../file-object';
import { Script } from './script';

const config = new AppConfig();

describe('Script', () => {
  describe('test', () => {
    it('should return true for style files', () => {
      expect(Script.test(new FileObject(`folder/file.${config.scripts.extension}`), config)).equal(true);
      expect(Script.test(new FileObject(`folder/file`), config)).equal(false);
    });
  });
});
