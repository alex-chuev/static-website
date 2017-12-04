import { TemplateHelpers } from '../interfaces/template-helpers';
import { TemplateHelpersFactory } from './template-helpers-factory';
import { Translation } from '../interfaces/translation';
import { defaultOptions } from '../default-options';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { TranslationService } from '../services/translation-service';
import * as fs from 'fs-extra';
import * as path from 'path';

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
let translationServiceStub: SinonStub;
let existsSyncStub: SinonStub;
let copySyncStub: SinonStub;

describe('TemplateHelpersFactory', () => {
  beforeEach(() => {
    templateHelpers = TemplateHelpersFactory.createTemplateHelpers(page, translation, options);
    translationServiceStub = stub(TranslationService, 'saveTranslation');
    existsSyncStub = stub(fs, 'existsSync');
    copySyncStub = stub(fs, 'copySync');
  });

  afterEach(() => {
    translationServiceStub.restore();
    existsSyncStub.restore();
    copySyncStub.restore();
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

  describe('asset method', () => {
    it('should work correct', () => {
      const file = 'images/image.png';

      existsSyncStub.returns(false);
      expect(() => templateHelpers.asset(file)).to.throw(`File ${file} doesn't exist.`);

      existsSyncStub.returns(true);
      expect(templateHelpers.asset(file)).equal(`/info/about/${file}`);
      expect(copySyncStub.calledWith(
        `src/info/about/${file}`.replace(/\//g, path.sep),
        `dist/info/about/${file}`.replace(/\//g, path.sep),
      )).equal(true);
    });
  });

  describe('link method', () => {
    it('should be correct', () => {
      expect(templateHelpers.link('/info/about/')).equal('<a href="/ru/info/about/">/ru/info/about/</a>');
      expect(templateHelpers.link('/info/about/', 'text')).equal('<a href="/ru/info/about/">text</a>');
      expect(templateHelpers.link('/info/about/', 'text', 'link')).equal('<a href="/ru/info/about/" class="link">text</a>');
      expect(templateHelpers.link('/info/docs/', 'text', 'link', 'link--active')).equal('<a href="/ru/info/docs/" class="link">text</a>');

      expect(templateHelpers.link('/info/about/', 'text', 'link', 'link--active'))
        .equal('<a href="/ru/info/about/" class="link link--active">text</a>');

      expect(templateHelpers.link('/info/about/', 'text', 'link', 'link--active', {
        tabindex: 2,
      })).equal('<a href="/ru/info/about/" class="link link--active" tabindex="2">text</a>');

      expect(templateHelpers.link('/info/about/', 'text', 'link', 'link--active', {
        tabindex: 2,
      }), 'de').equal('<a href="/de/info/about/" class="link link--active" tabindex="2">text</a>');

      expect(templateHelpers.link('/info/about/', 'text', 'link', 'link--active', {
        tabindex: 2,
      }), 'en').equal('<a href="/info/about/" class="link link--active" tabindex="2">text</a>');
    });
  });

  describe('languageLink method', () => {
    it('should be correct', () => {
      expect(templateHelpers.languageLink('en', 'text', 'link', 'link--active', {
        tabindex: 2,
      })).equal('<a href="/info/about/" class="link link--active" tabindex="2">text</a>');

      expect(templateHelpers.languageLink('de', 'text', 'link', 'link--active', {
        tabindex: 2,
      })).equal('<a href="/de/info/about/" class="link link--active" tabindex="2">text</a>');
    });
  });
});
