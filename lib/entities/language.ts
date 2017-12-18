import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import { File } from 'gulp-util';

export class Language {
  name: string;
  url: Url;
  translation: Translation;

  constructor(file: File, options: Config) {
    this.name = file.stem;
    this.url = Language.getUrl(this.name, options);
    this.translation = JSON.parse(file.contents.toString());
  }

  static getUrl(language: string, options: Config): string {
    return language === options.translations.defaultLanguage ? '' : language;
  }
}
