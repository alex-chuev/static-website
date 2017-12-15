import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Options } from '../interfaces/options';
import { File } from 'gulp-util';

export class Language {
  name: string;
  url: Url;
  translation: Translation;

  constructor(file: File, options: Options) {
    this.name = file.stem;
    this.url = Language.getUrl(this.name, options);
    this.translation = JSON.parse(file.contents.toString());
  }

  static getUrl(language: string, options: Options): string {
    return language === options.translations.defaultLanguage ? '' : language;
  }
}
