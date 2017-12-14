import { FilePath, string } from '../types';
import { Language } from './language';
import * as File from 'vinyl';
import { Options } from '../interfaces/options';
import * as path from 'path';
import { replaceExtension } from 'gulp-util';
import { Code } from './code';

export interface Page extends File {
  data: PageData;
}

export class PageData {
  id: string;
  css = new Code();
  js = new Code();
  otherLanguages: Language[];

  constructor(
    public file: File,
    public language: Language,
    public languages: Language[],
    private options: Options,
  ) {
    this.id = replaceExtension(this.file.relative, '');
    this.otherLanguages = this.languages.filter(language => language !== this.language);
  }

  get externalStylesPath(): FilePath {
    return path.join(this.options.src.folder, this.options.pages.folder, `${this.id}.${this.options.styles.extension}`);
  }

  get inlineStylesPath(): FilePath {
    return path.join(this.options.src.folder, this.options.pages.folder, `${this.id}.inline.${this.options.styles.extension}`);
  }

  get externalScriptsPath(): FilePath {
    return path.join(this.options.src.folder, this.options.pages.folder, `${this.id}.${this.options.scripts.extension}`);
  }

  get inlineScriptsPath(): FilePath {
    return path.join(this.options.src.folder, this.options.pages.folder, `${this.id}.inline.${this.options.scripts.extension}`);
  }
}
