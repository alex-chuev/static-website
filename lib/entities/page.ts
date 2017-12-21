import { Language } from './language';
import { CodeType } from './code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { PropertyPath } from 'lodash';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { removeExtension } from '../helpers/path-helpers';
import { Environment } from '../interfaces/environment';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { readFileSync } from "fs";
import { BuildCache } from '../cache';
import { Config } from '../interfaces/config';
import * as path from 'path';

export class PageData {
  language: Language;
  css: CodeType;
  js: CodeType;
  otherLanguages: Language[];
  currentUrl: Url;
  environment: Environment;
  currentDefaultLanguageUrl: Url;
  asset: (relativeUrl: Url) => Url;
  url: (relativeUrl: Url, languageName: string) => Url;
  languageUrl: (languageName: string) => Url;
  isActive: (relativeUrl: Url) => boolean;
  i18n: (message: PropertyPath, otherwise: string) => string;
  link: (url: Url, text?: string, className?: string, activeClass?: string, attrs?: Attrs, language?: string) => string;
  languageLink: (language: string, text?: string, className?: string, activeClass?: string, attrs?: Attrs) => string;

  constructor(page: Page, language: Language, cache: BuildCache) {
    this.language = language;
    this.environment = cache.environment;
    this.otherLanguages = cache.languages.filter(item => item !== language);

    this.css = new CodeType();
    this.css.external.push(cache.globalExternalCss, cache.pageExternalCss.get(page));
    this.js = new CodeType();
    this.js.external.push(cache.globalExternalJs, cache.pageExternalJs.get(page));

    if (cache.environment.production) {
      this.css.inline.push(cache.globalInlineCss, cache.pageInlineCss.get(page));
      this.js.inline.push(cache.globalInlineJs, cache.pageInlineJs.get(page));
    } else {
      this.css.external.push(cache.globalInlineCss, cache.pageInlineCss.get(page));
      this.js.external.push(cache.globalInlineJs, cache.pageInlineJs.get(page));
    }

    this.asset = (relativeUrl: Url) => assetHelper(relativeUrl, cache.config);
    this.currentUrl = urlHelper(page.defaultLanguageUrl, this.language.url, cache.config);
    this.currentDefaultLanguageUrl = page.defaultLanguageUrl;
    this.url = (relativeUrl: Url, languageName = language.name) => urlHelper(
      relativeUrl, languageName, cache.config);
    this.languageUrl = (languageName: string) => urlHelper(page.defaultLanguageUrl, languageName, cache.config);
    this.isActive = (relativeUrl: Url) =>
      this.currentDefaultLanguageUrl === createAbsoluteUrl(relativeUrl, cache.config);
    this.i18n = (message: PropertyPath, otherwise = ''): string => this.language.translate(message, otherwise);
    this.link = (
      url: Url, content?: string, className?: string, activeClassName?: string, attrs?: Attrs, languageName = language.name): string => {
      return HtmlFactory.createLink(this.url(url, languageName), content, className, activeClassName, this.isActive(url), attrs,
        languageName);
    };
    this.languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
      return this.link(this.currentDefaultLanguageUrl, text, className, activeClass, attributes, language);
    }

  }
}

export class Page {
  content: string;
  fullPathWithoutExt: string;
  relativePathWithoutExt: string;
  defaultLanguageUrl: string;

  constructor(public fullPath: string, config: Config) {
    this.fullPathWithoutExt = removeExtension(this.fullPath);
    this.relativePathWithoutExt = path.relative(path.join(config.src.folder, config.pages.folder), this.fullPathWithoutExt);
    this.content = readFileSync(this.fullPath, 'utf-8');
    this.defaultLanguageUrl = createAbsoluteUrl(`${this.relativePathWithoutExt}.html`, config);
  }
}
