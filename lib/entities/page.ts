import { FilePath, PageId } from '../types';
import { Language } from './language';
import * as File from 'vinyl';
import { Options } from '../interfaces/options';
import { Codes } from './codes';
import * as path from 'path';
import { replaceExtension } from 'gulp-util';

export interface Page extends File {
  data: PageData;
}

export class PageData {
  id: PageId;
  language: Language;
  languages: Language[];
  codes = new Codes();

  constructor(public file: File, public options: Options) {
    this.id = replaceExtension(this.file.relative, '');
  }

  get externalStylesPath(): FilePath {
    return path.join(this.options.src.folder, this.options.styles.folder, `${this.id}.${this.options.styles.extension}`);
  }

  get inlineStylesPath(): FilePath {
    return path.join(this.options.src.folder, this.options.styles.folder, `${this.id}.inline.${this.options.styles.extension}`);
  }

  get externalScriptsPath(): FilePath {
    return path.join(this.options.src.folder, this.options.scripts.folder, `${this.id}.${this.options.scripts.extension}`);
  }

  get inlineScriptsPath(): FilePath {
    return path.join(this.options.src.folder, this.options.scripts.folder, `${this.id}.inline.${this.options.scripts.extension}`);
  }

  get otherLanguages(): Language[] {
    return this.languages.filter(language => language !== this.language);
  }
}
