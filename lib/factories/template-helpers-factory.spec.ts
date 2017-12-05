import { TemplateHelpers } from '../interfaces/template-helpers';
import { TemplateHelpersFactory } from './template-helpers-factory';
import { Translation } from '../interfaces/translation';
import { defaultOptions } from '../default-options';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { TranslationService } from '../services/translation-service';
import * as fs from 'fs-extra';
import { ConsoleService } from '../services/console-service';

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
let consoleServiceErrorStub: SinonStub;
let consoleServiceDistStub: SinonStub;

describe('TemplateHelpersFactory', () => {
  beforeEach(() => {
    templateHelpers = TemplateHelpersFactory.createTemplateHelpers(page, translation, options);
    translationServiceStub = stub(TranslationService, 'saveTranslation');
    existsSyncStub = stub(fs, 'existsSync');
    copySyncStub = stub(fs, 'copySync');
    consoleServiceErrorStub = stub(ConsoleService, 'error');
    consoleServiceDistStub = stub(ConsoleService, 'dist');
  });

  afterEach(() => {
    translationServiceStub.restore();
    existsSyncStub.restore();
    copySyncStub.restore();
    consoleServiceErrorStub.restore();
    consoleServiceDistStub.restore();
  });

  describe('currentUrl property', () => {
    it('should be correct', () => {
      expect(templateHelpers.currentUrl).equal('/ru/info/about/');
    });
  });

  describe('url method', () => {
    it('should works correct', () => {
      expect(templateHelpers.url('/')).equal('/ru/');
      expect(templateHelpers.url('/index.html')).equal('/ru/');
      expect(templateHelpers.url('/contacts/')).equal('/ru/contacts/');

      expect(templateHelpers.url('/', 'en')).equal('/');
      expect(templateHelpers.url('/index.html', 'en')).equal('/');
      expect(templateHelpers.url('/contacts/', 'en')).equal('/contacts/');

      expect(templateHelpers.url('/', 'de')).equal('/de/');
      expect(templateHelpers.url('/index.html', 'de')).equal('/de/');
      expect(templateHelpers.url('/contacts/', 'de')).equal('/de/contacts/');
    });
  });

  describe('isActiveUrl method', () => {
    it('should works correct', () => {
      expect(templateHelpers.isActiveUrl('/info/about/')).equal(true);
      expect(templateHelpers.isActiveUrl('/info/about/index.html')).equal(true);
      expect(templateHelpers.isActiveUrl('/info/about/')).equal(true);
      expect(templateHelpers.isActiveUrl('/info/about')).equal(false);
      expect(templateHelpers.isActiveUrl('/info/about.html')).equal(false);
    });
  });

  describe('languageUrl method', () => {
    it('should works correct', () => {
      expect(templateHelpers.languageUrl('en')).equal('/info/about/');
      expect(templateHelpers.languageUrl('ru')).equal('/ru/info/about/');
      expect(templateHelpers.languageUrl('de')).equal('/de/info/about/');
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
      expect(consoleServiceErrorStub.calledOnce).equal(false);
      expect(templateHelpers.asset(file)).equal(undefined);
      expect(consoleServiceErrorStub.calledOnce).equal(true);

      existsSyncStub.returns(true);
      expect(templateHelpers.asset(file)).equal(`/info/about/${file}`);
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
      }, 'de')).equal('<a href="/de/info/about/" class="link link--active" tabindex="2">text</a>');

      expect(templateHelpers.link('/info/about/', 'text', 'link', 'link--active', {
        tabindex: 2,
      }, 'en')).equal('<a href="/info/about/" class="link link--active" tabindex="2">text</a>');
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
