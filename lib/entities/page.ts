import { Language } from './language';
import { PageCode } from './code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { PropertyPath } from 'lodash';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { removeExtension } from '../helpers/path-helpers';
import { Environment } from '../interfaces/environment';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { readFileSync } from 'fs';
import { BuildCache } from '../cache';
import { Config } from '../interfaces/config';
import * as path from 'path';
import { Code, CssCode, JsCode } from '../tasks/code';

export class PageData {
  language: Language;
  css: PageCode;
  js: PageCode;
  otherLanguages: Language[];
  currentUrl: Url;
  environment: Environment;
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
    this.css = getPageCss(page, cache);
    this.js = getPageJs(page, cache);
    this.asset = (relativeUrl: Url) => assetHelper(relativeUrl, cache.config);
    this.currentUrl = urlHelper(page.distPathWithExt, this.language.url, cache.config);
    this.url = (relativeUrl: Url, languageName = language.name) => urlHelper(
      relativeUrl, languageName, cache.config);
    this.languageUrl = (languageName: string) => urlHelper(page.distPathWithExt, languageName, cache.config);
    this.isActive = (relativeUrl: Url) =>
      page.defaultLanguageUrl === createAbsoluteUrl(relativeUrl, cache.config);
    this.i18n = (message: PropertyPath, otherwise = ''): string => this.language.translate(message, otherwise);
    this.link = (
      url: Url, content?: string, className?: string, activeClassName?: string, attrs?: Attrs, languageName = language.name): string => {
      return HtmlFactory.createLink(this.url(url, languageName), content, className, activeClassName, this.isActive(url), attrs,
        languageName);
    };
    this.languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
      return this.link(page.defaultLanguageUrl, text, className, activeClass, attributes, language);
    }

  }
}

function getPageJs(page: Page, cache: BuildCache): PageCode {
  const external: JsCode[] = [
    cache.globalExternalJs,
    cache.pageExternalJs.get(page),
  ];
  const inline: JsCode[] = [];

  cache.environment.production ?
    inline.push(
      cache.globalInlineJs,
      cache.pageInlineJs.get(page),
    ) :
    external.push(
      cache.globalInlineJs,
      cache.pageInlineJs.get(page),
    );

  return getPageCode(inline, external);
}

function getPageCss(page: Page, cache: BuildCache): PageCode {
  const external: CssCode[] = [
    cache.globalExternalCss,
    cache.pageExternalCss.get(page),
  ];
  const inline: CssCode[] = [];

  cache.environment.production ?
    inline.push(
      cache.globalInlineCss,
      cache.pageInlineCss.get(page),
    ) :
    external.push(
      cache.globalInlineCss,
      cache.pageInlineCss.get(page),
    );

  return getPageCode(inline, external);
}

function getPageCode(inline: Code[], external: Code[]): PageCode {
  const code = new PageCode();

  inline
    .filter(item => item)
    .forEach(item => code.inline.push(item.content));

  external
    .filter(item => item)
    .forEach(item => code.external.push(item.url));

  return code;
}

export class Page {
  content: string;
  relativePathWithoutExt: string;
  defaultLanguageUrl: string;
  distPathWithExt: string;

  constructor(public fullPath: string, config: Config) {
    this.relativePathWithoutExt = path.relative(path.join(config.src.folder, config.pages.folder), removeExtension(this.fullPath));
    this.content = readFileSync(this.fullPath, 'utf-8');
    this.distPathWithExt = `${this.relativePathWithoutExt}.html`;
    this.defaultLanguageUrl = createAbsoluteUrl(this.distPathWithExt, config);
  }
}
