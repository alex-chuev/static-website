import { Language } from './language';
import * as File from 'vinyl';
import { Code, CodeType } from './code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import { Config } from '../interfaces/config';
import { PropertyPath } from 'lodash';
import { assetHelper, urlHelper } from '../helpers/template-helpers';
import { removeExtension } from '../helpers/path-helpers';

export interface PageFile extends File {
  data: PageData;
}

export interface PageDataProps {
  config: Config;
  languages: Language[];
  file: File;
  language: Language;
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
  currentDefaultLanguageUrl: Url;
  assets: File[] = [];
  asset: (relativeUrl: Url) => Url;
  url: (relativeUrl: Url, languageName: string) => Url;
  languageUrl: (languageName: string) => Url;
  isActive: (relativeUrl: Url) => boolean;
  i18n: (message: PropertyPath, otherwise: string) => string;

  constructor(props: PageDataProps) {
    this.language = props.language;
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
  }
}
