import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { AppConfig } from './app-config';
import * as _ from 'lodash';
import * as path from 'path';
import { outputJsonSync, readJsonSync } from 'fs-extra';
import { sortObject } from '../helpers/object-helpers';

export class Language {
  name: string;
  url: Url;
  translation: Translation;
  updated = false;

  static getUrl(language: string, config: AppConfig): string {
    return language === config.translations.defaultLanguage ? '' : language;
  }

  constructor(public absolutePath: string, private config: AppConfig) {
    this.name = path.parse(this.absolutePath).name;
    this.translation = readJsonSync(this.absolutePath);
    this.url = Language.getUrl(this.name, this.config);
  }

  translate(message: string, otherwise: any = ''): string {
    if (_.has(this.translation, message)) {
      return _.get(this.translation, message);
    } else if (this.config.translations.generate) {
      this.updated = true;
      _.set(this.translation, message, otherwise);
    }

    return otherwise;
  }

  saveUpdated() {
    if (this.updated) {
      outputJsonSync(this.absolutePath, sortObject(this.translation), {spaces: 2});
      this.updated = false;
    }
  }

}
