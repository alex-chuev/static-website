import { Language } from './language';
import { File } from 'gulp-util';
import { replaceExtension } from 'gulp-util';
import { Code } from './code';
import { PageCode } from './page-code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import { Options } from '../interfaces/options';
import { PropertyPath } from 'lodash';
import { assetHelper, i18nHelper, urlHelper } from '../helpers/template-helpers';

export interface Page extends File {
  data: PageData;
}

export class PageDependencies {
  languages: Language[];
  code: PageCode;
  globalCode: PageCode;
}

export interface PageDataProps {
  file: File;
  language: Language;
  options: Options;
  dependencies: PageDependencies;
}

export class PageData {
  id: string;
  css = new Code();
  js = new Code();
  language: Language;
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
    this.id = replaceExtension(props.file.relative, '');
    this.otherLanguages = props.dependencies.languages.filter(language => language !== props.language);

    this.asset = (relativeUrl: Url) => assetHelper(relativeUrl, props.options);
    this.currentUrl = urlHelper(`${this.id}.html`, this.language.url, props.options);
    this.currentDefaultLanguageUrl = createAbsoluteUrl(`${this.id}.html`, props.options);
    this.url = (relativeUrl: Url, languageName = props.language.name) => urlHelper(relativeUrl, languageName, props.options);
    this.languageUrl = (languageName: string) => urlHelper(`${this.id}.html`, languageName, props.options);
    this.isActive = (relativeUrl: Url) =>
      this.currentDefaultLanguageUrl === createAbsoluteUrl(relativeUrl, props.options);
    this.i18n = (message: PropertyPath, otherwise = ''): string => i18nHelper(message, otherwise, props);
  }
}
