import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import * as File from 'vinyl';
import * as _ from 'lodash';
import { PropertyPath } from 'lodash';
import * as path from 'path';

export class Language {
  name: string;
  url: Url;
  translation: Translation;
  updated = false;

  constructor(public file: File, private config: Config) {
    this.name = path.parse(file.path).name;
    this.url = Language.getUrl(this.name, config);
    this.translation = JSON.parse(file.contents.toString());
  }

  static getUrl(language: string, options: Config): string {
    return language === options.translations.defaultLanguage ? '' : language;
  }

  translate(message: PropertyPath, otherwise: any = ''): string {
    if (_.has(this.translation, message)) {
      return _.get(this.translation, message);
    } else if (this.config.translations.generate) {
      this.updated = true;
      _.set(this.translation, message, otherwise);
    }

    return otherwise;
  }

}
