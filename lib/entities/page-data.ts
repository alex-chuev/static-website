import { UrlHelpers } from '../helpers/url-helpers';
import { Language } from './language';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { Url } from '../types';
import { AppConfig } from './app/app-config';
import { AppLanguages } from './app/app-languages';
import * as _ from 'lodash';
import { StaticCode } from './code/static-code';
import { Page } from './code/page';
import { StaticCodes } from './code/static-codes';
import * as path from 'path';

class PageCodes {

  external: Url[];
  inline: string[];

  constructor(codes: StaticCode[], config: AppConfig) {
    codes = _.sortBy<StaticCode>(codes, code => code.external ? -1 : 1);

    const external = StaticCode.getExternal(codes, config);
    const inline = _.difference(codes, external);

    this.external = external.map(code => code.url);
    this.inline = inline.map(code => code.content);
  }

}

export class PageData {
  css = new PageCodes(this.codes.css.concat(this.page.codes.css), this.config);
  js = new PageCodes(this.codes.js.concat(this.page.codes.js), this.config);

  otherLanguages = _.filter(this.languages.items, item => item !== this.language);
  file = this.page.file;

  constructor(
    public page: Page,
    public language: Language,
    public config: AppConfig,
    public languages: AppLanguages,
    public codes: StaticCodes,
  ) {
  }

  asset = (relativeUrl: Url) => UrlHelpers.createAbsoluteUrl(relativeUrl, this.config);

  currentUrl = this.page.createLanguageUrl(this.language);

  url = (relativeUrl: Url, languageName = this.language.name) => {
    const languageUrl = Language.createUrlByName(languageName, this.config);

    return UrlHelpers.createAbsoluteUrl(path.join(languageUrl, relativeUrl), this.config)
  }

  languageUrl = (languageName: string) => this.url(this.page.relativeDistPath, languageName);

  isActive = (relativeUrl: Url) => this.page.defaultLanguageUrl === UrlHelpers.createAbsoluteUrl(relativeUrl, this.config);

  i18n = (message: string, otherwise = ''): string => this.language.translate(message, otherwise);

  exportMessages = (message: string, otherwise = '', variable = 'messages'): string => {
    const str = JSON.stringify(this.i18n(message, otherwise));

    return `<script>window['${variable}']=${str}</script>`;
  }

  registerMessages = (message: string, otherwise = '', func = 'registerMessages'): string => {
    const str = JSON.stringify(this.i18n(message, otherwise));

    return `<script>${func}(${str})</script>`;
  }

  link = (url: Url, content?: string, className?: string, activeClass?: string, attrs?: Attrs, lang = this.language.name): string => {
    const href = this.url(url, lang);
    const isActive = this.isActive(url);

    return HtmlFactory.createLink(href, content, className, activeClass, isActive, attrs, lang);
  }

  languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
    return this.link(this.page.defaultLanguageUrl, text, className, activeClass, attributes, language);
  }

}
