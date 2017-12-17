import { Language } from './language';
import { File } from 'gulp-util';
import { replaceExtension } from 'gulp-util';
import { Code } from './code';
import { PageCode } from './page-code';
import { Url } from '../types';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import { Options } from '../interfaces/options';

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
  assets: File[] = [];
  asset: (filename: string) => Url;

  constructor(
    props: PageDataProps,
  ) {
    this.language = props.language;
    this.id = replaceExtension(props.file.relative, '');
    this.otherLanguages = props.dependencies.languages.filter(language => language !== props.language);
    this.asset = (filename: string) => createAbsoluteUrl(filename, props.options);
  }
}
