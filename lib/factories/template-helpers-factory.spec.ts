import { TemplateHelpers } from '../interfaces/template-helpers';
import { TemplateHelpersFactory } from './template-helpers-factory';
import { Translation } from '../interfaces/translation';
import { defaultOptions } from '../default-options';
import { expect } from 'chai';
import { SinonSpy, stub } from 'sinon';
import { TranslationService } from '../services/translation-service';

let templateHelpers: TemplateHelpers;
const page = 'info/about/index';
const translation: Translation = {
  language: 'ru',
  languageUrlPart: 'ru',
  meta: {
    title: 'title'
  },
};
const options = defaultOptions;
let translationServiceStub: SinonSpy;

describe('TemplateHelpersFactory', () => {
  beforeEach(() => {
    templateHelpers = TemplateHelpersFactory.createTemplateHelpers(page, translation, options);
    translationServiceStub = stub(TranslationService, 'saveTranslation');
  });

  afterEach(() => {
    translationServiceStub.restore();
  });

  describe('currentUrl property', () => {
    it('should be correct', () => {
      expect(templateHelpers.currentUrl).equal('/ru/info/about/');
    });
  });

  describe('i18n method', () => {
    it('should work correct', () => {
      const otherwise = [];

      expect(templateHelpers.i18n('meta.title')).equal('title');
      expect(translationServiceStub.callCount).equal(0);

      expect(templateHelpers.i18n('deep.path')).equal('');
      expect(translationServiceStub.callCount).equal(1);

      expect(templateHelpers.i18n('another.deep.path', otherwise)).equal(otherwise);
      expect(translationServiceStub.callCount).equal(2);

      expect(templateHelpers.i18n('another.deep.path')).equal(otherwise);
      expect(translationServiceStub.callCount).equal(2);
    });
  });
});
