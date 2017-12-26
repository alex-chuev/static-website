import { Language } from './language';
import { PageCode } from './page-code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { PropertyPath } from 'lodash';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { removeExtension } from '../helpers/path-helpers';
import { Environment } from '../interfaces/environment';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { readFileSync } from 'fs';
import { App } from '../app';
import { Config } from './config';
import * as path from 'path';
import { Code, CssCode, JsCode } from '../tasks/code';

export class PageData {
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

  constructor(page: Page, public language: Language, app: App) {
    this.environment = app.environment;
    this.otherLanguages = app.languages.filter(item => item !== language);
    this.css = getPageCss(page, app);
    this.js = getPageJs(page, app);
    this.asset = (relativeUrl: Url) => assetHelper(relativeUrl, app.config);
    this.currentUrl = urlHelper(page.distPathWithExt, this.language.url, app.config);
    this.url = (relativeUrl: Url, languageName = language.name) => urlHelper(relativeUrl, languageName, app.config);
    this.languageUrl = (languageName: string) => urlHelper(page.distPathWithExt, languageName, app.config);
    this.isActive = (relativeUrl: Url) =>
      page.defaultLanguageUrl === createAbsoluteUrl(relativeUrl, app.config);
    this.i18n = (message: PropertyPath, otherwise = ''): string => this.language.translate(message, otherwise);
    this.link = (url: Url, content?: string, className?: string, activeClassName?: string, attrs?: Attrs, languageName = language.name): string => {
      return HtmlFactory.createLink(this.url(url, languageName), content, className, activeClassName, this.isActive(url), attrs, languageName);
    };
    this.languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
      return this.link(page.defaultLanguageUrl, text, className, activeClass, attributes, language);
    }

  }
}

function getPageJs(page: Page, app: App): PageCode {
  const external: JsCode[] = [
    app.externalJs,
    app.pageExternalJs.get(page),
  ];
  const inline: JsCode[] = [];

  app.environment.production ?
    inline.push(
      app.inlineJs,
      app.pageInlineJs.get(page),
    ) :
    external.push(
      app.inlineJs,
      app.pageInlineJs.get(page),
    );

  return getPageCode(inline, external);
}

function getPageCss(page: Page, app: App): PageCode {
  const external: CssCode[] = [
    app.externalCss,
    app.pageExternalCss.get(page),
  ];
  const inline: CssCode[] = [];

  app.environment.production ?
    inline.push(
      app.inlineCss,
      app.pageInlineCss.get(page),
    ) :
    external.push(
      app.inlineCss,
      app.pageInlineCss.get(page),
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
    this.relativePathWithoutExt = path.relative(config.pagesFolder, removeExtension(this.fullPath));
    this.content = readFileSync(this.fullPath, 'utf-8');
    this.distPathWithExt = `${this.relativePathWithoutExt}.html`;
    this.defaultLanguageUrl = createAbsoluteUrl(this.distPathWithExt, config);
  }
}
