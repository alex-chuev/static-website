import { expect } from 'chai';
import { Style } from './style';
import { AppConfig } from '../app/app-config';
import { FileObject } from '../file-object';

const config = new AppConfig();

describe('Style', () => {
  describe('test', () => {
    it('should return true for style files', () => {
      expect(Style.test(new FileObject(`folder/file.${config.styles.extension}`), config)).equal(true);
      expect(Style.test(new FileObject(`folder/file`), config)).equal(false);
    });
  });
});
