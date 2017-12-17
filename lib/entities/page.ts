import { Language } from './language';
import { File } from 'gulp-util';
import { replaceExtension } from 'gulp-util';
import { Code } from './code';
import { PageCode } from './page-code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import { Options } from '../interfaces/options';
import * as path from 'path';

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

  constructor(props: PageDataProps) {
    this.language = props.language;
    this.id = replaceExtension(props.file.relative, '');
    this.otherLanguages = props.dependencies.languages.filter(language => language !== props.language);

    this.asset = (relativeUrl: Url) => asset(relativeUrl, props.options);
    this.currentUrl = url(`${this.id}.html`, this.language.url, props.options);
    this.currentDefaultLanguageUrl = createAbsoluteUrl(`${this.id}.html`, props.options);
    this.url = (relativeUrl: Url, languageName = props.language.name) => url(relativeUrl, languageName, props.options);
    this.languageUrl = (languageName: Url) => url(`${this.id}.html`, languageName, props.options);
  }
}

function asset(relativeUrl: Url, options: Options): Url {
  return createAbsoluteUrl(relativeUrl, options);
}

function url(relativeUrl: Url, languageName: string, options: Options): Url {
  return createAbsoluteUrl(path.join(Language.getUrl(languageName, options), relativeUrl), options);
}
