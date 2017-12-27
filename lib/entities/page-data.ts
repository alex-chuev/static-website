import { Environment } from '../interfaces/environment';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { Language } from './language';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { Url } from '../types';
import { PageCodes } from './page-codes';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { Page } from './page';
import { AppConfig } from './app-config';
import { AppLanguages } from './app-languages';
import { CssCodes } from './css-codes';
import { JsCodes } from './js-codes';
import * as _ from 'lodash';

export class PageData {
  otherLanguages = _.filter(this.languages.items, item => item !== this.language);

  css: PageCodes;
  js: PageCodes;

  constructor(
    public page: Page,
    public language: Language,
    public config: AppConfig,
    public environment: Environment,
    public languages: AppLanguages,
    appCssCodes: CssCodes,
    appJsCodes: JsCodes,
  ) {
    this.css = new PageCodes(page.css.items.concat(appCssCodes.items), environment);
    this.js = new PageCodes(page.js.items.concat(appJsCodes.items), environment);
  }

  asset = (relativeUrl: Url) => assetHelper(relativeUrl, this.config);

  currentUrl = urlHelper(this.page.distPathWithExt, this.language.url, this.config);

  url = (relativeUrl: Url, languageName = this.language.name) => urlHelper(relativeUrl, languageName, this.config);

  languageUrl = (languageName: string) => urlHelper(this.page.distPathWithExt, languageName, this.config);

  isActive = (relativeUrl: Url) => this.page.defaultLanguageUrl === createAbsoluteUrl(relativeUrl, this.config);

  i18n = (message: string, otherwise = ''): string => this.language.translate(message, otherwise);

  link = (url: Url, content?: string, className?: string, activeClass?: string, attrs?: Attrs, lang = this.language.name): string => {
    const href = this.url(url, lang);
    const isActive = this.isActive(url);

    return HtmlFactory.createLink(href, content, className, activeClass, isActive, attrs, lang);
  }

  languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
    return this.link(this.page.defaultLanguageUrl, text, className, activeClass, attributes, language);
  }
}
