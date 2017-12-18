import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import * as File from 'vinyl';

export class Language {
  name: string;
  url: Url;
  translation: Translation;

  constructor(public file: File, options: Config) {
    this.name = file.stem;
    this.url = Language.getUrl(this.name, options);
    this.translation = JSON.parse(file.contents.toString());
  }

  static getUrl(language: string, options: Config): string {
    return language === options.translations.defaultLanguage ? '' : language;
  }
}
