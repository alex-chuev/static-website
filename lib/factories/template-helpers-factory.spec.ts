import { TemplateHelpers } from '../interfaces/template-helpers';
import { TemplateHelpersFactory } from './template-helpers-factory';
import { Translation } from '../interfaces/translation';
import { defaultOptions } from '../default-options';
import { expect } from 'chai';

let templateHelpers: TemplateHelpers;
const page = 'info/about/index';
const translation: Translation = {
  language: 'ru',
  languageUrlPart: 'ru',
};
const options = defaultOptions;

describe('TemplateHelpersFactory', () => {
  beforeEach(() => {
    templateHelpers = TemplateHelpersFactory.createTemplateHelpers(page, translation, options);
  });

  describe('currentUrl property', () => {
    it('should be correct', () => {
      expect(templateHelpers.currentUrl).equal('/ru/info/about/');
    });
  });
});
