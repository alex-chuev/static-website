import { Language } from './language';
import * as File from 'vinyl';
import { Code, CodeType } from './code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { Config } from '../interfaces/config';
import { PropertyPath } from 'lodash';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { removeExtension } from '../helpers/path-helpers';
import { Environment } from '../interfaces/environment';
import { Attrs } from '../interfaces/attributes';
import { HtmlFactory } from '../factories/html-factory';
import { readFileSync } from "fs";

export interface PageFile extends File {
  data: PageData;
}

export interface PageDataProps {
  config: Config;
  languages: Language[];
  file: File;
  language: Language;
  environment: Environment;
  code: Code;
}

export class PageData {
  id: string;
  language: Language;
  css: CodeType;
  js: CodeType;
  options: Config;
  otherLanguages: Language[];
  currentUrl: Url;
  environment: Environment;
  currentDefaultLanguageUrl: Url;
  assets: File[] = [];
  asset: (relativeUrl: Url) => Url;
  url: (relativeUrl: Url, languageName: string) => Url;
  languageUrl: (languageName: string) => Url;
  isActive: (relativeUrl: Url) => boolean;
  i18n: (message: PropertyPath, otherwise: string) => string;
  link: (url: Url, text?: string, className?: string, activeClass?: string, attrs?: Attrs, language?: string) => string;
  languageLink: (language: string, text?: string, className?: string, activeClass?: string, attrs?: Attrs) => string;

  constructor(props: PageDataProps) {
    this.language = props.language;
    this.environment = props.environment;
    this.options = props.config;
    this.id = removeExtension(props.file.relative,);
    this.otherLanguages = props.languages.filter(language => language !== props.language);
    this.css = props.code.css;
    this.js = props.code.js;

    this.asset = (relativeUrl: Url) => assetHelper(relativeUrl, props.config);
    this.currentUrl = urlHelper(`${this.id}.html`, this.language.url, props.config);
    this.currentDefaultLanguageUrl = createAbsoluteUrl(`${this.id}.html`, props.config);
    this.url = (relativeUrl: Url, languageName = props.language.name) => urlHelper(
      relativeUrl, languageName, props.config);
    this.languageUrl = (languageName: string) => urlHelper(`${this.id}.html`, languageName, props.config);
    this.isActive = (relativeUrl: Url) =>
      this.currentDefaultLanguageUrl === createAbsoluteUrl(relativeUrl, props.config);
    this.i18n = (message: PropertyPath, otherwise = ''): string => this.language.translate(message, otherwise);
    this.link = (url: Url, content?: string, className?: string, activeClassName?: string, attrs?: Attrs, language = props.language.name): string => {
      return HtmlFactory.createLink(this.url(url, language), content, className, activeClassName, this.isActive(url), attrs, language);
    };
    this.languageLink = (language: string, text?: string, className?: string, activeClass?: string, attributes?: Attrs): string => {
      return this.link(createAbsoluteUrl(`${this.id}.html`, props.config), text, className, activeClass, attributes, language);
    }

  }
}

export class Page {
  id: string;
  content: string;

  constructor(file: string) {
    this.id = removeExtension(file);
    this.content = readFileSync(file, 'utf-8');
  }
}
