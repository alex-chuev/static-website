import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import * as _ from 'lodash';
import { PropertyPath } from 'lodash';
import * as path from 'path';
import { outputJsonSync, readJsonSync } from 'fs-extra';
import { sortObject } from '../helpers/object-helpers';

export class Language {
  name: string;
  url: Url;
  translation: Translation;
  updated = false;

  static getUrl(language: string, config: Config): string {
    return language === config.translations.defaultLanguage ? '' : language;
  }

  constructor(public file: string, private config: Config) {
    this.name = path.parse(this.file).name;
    this.translation = readJsonSync(this.file);
    this.url = Language.getUrl(this.name, this.config);
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

  save() {
    if (this.updated) {
      outputJsonSync(this.file, sortObject(this.translation), {spaces: 2});
      this.updated = false;
    }
  }

}
