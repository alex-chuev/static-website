import { Language } from './language';
import { File } from 'gulp-util';
import { replaceExtension } from 'gulp-util';
import { Code } from './code';
import { PageCode } from './page-code';

export interface Page extends File {
  data: PageData;
}

export class PageDependencies {
  languages: Language[];
  code: PageCode;
  globalCode: PageCode;
}

export class PageDataProps {
  file: File;
  language: Language;
  dependencies: PageDependencies;
}

export class PageData {
  id: string;
  css = new Code();
  js = new Code();
  language: Language;
  otherLanguages: Language[];
  assets: File[] = [];

  constructor(
    props: PageDataProps,
  ) {
    this.language = props.language;
    this.id = replaceExtension(props.file.relative, '');
    this.otherLanguages = props.dependencies.languages.filter(language => language !== props.language);
  }
}
