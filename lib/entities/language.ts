import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { AppConfig } from './app/app-config';
import * as _ from 'lodash';
import { sortObject } from '../helpers/object-helpers';
import { FileObject } from './file-object';

export class Language {
  name: string;
  url: Url;
  translation: Translation;
  updated = false;

  static getUrl(language: string, config: AppConfig): string {
    return language === config.translations.defaultLanguage ? '' : language;
  }

  constructor(public file: FileObject, private config: AppConfig) {
    this.name = this.file.name;
    this.url = Language.getUrl(this.name, this.config);

    this.updateTranslation();
  }

  updateTranslation() {
    this.translation = this.file.readJson();
  }

  addMessage(message: string, value: any) {
    this.translate(message, value);
    this.saveUpdated();
  }

  translate(message: string, otherwise: any = ''): string {
    if (false === _.has(this.translation, message)) {
      _.set(this.translation, message, otherwise);
      this.updated = true;
    }

    return _.get(this.translation, message);
  }

  saveUpdated() {
    if (this.updated) {
      this.file.writeJson(sortObject(this.translation));
      this.updated = false;
    }
  }

}
