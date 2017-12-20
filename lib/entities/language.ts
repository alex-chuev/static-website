import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import * as _ from 'lodash';
import { PropertyPath } from 'lodash';

export class Language {
  url: Url;
  updated = false;

  constructor(public name: string, public translation: Translation, private config: Config) {
    this.url = Language.getUrl(this.name, this.config);
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
