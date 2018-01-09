import * as _ from 'lodash';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import * as glob from 'glob';
import { Language } from './language';
import { AppConfig } from './app-config';
import * as path from 'path';

export class AppLanguages {

  items: Language[] = [];

  constructor(private config: AppConfig) {
    glob.sync(this.config.translationsGlob)
      .forEach(file => this.addLanguage(file));
  }

  addLanguage(file: string): Language {
    file = this.createAbsolutePath(file);

    const language = new Language(file, this.config);
    this.items.push(language);
    return language;
  }

  removeLanguages(file: string): Language[] {
    file = this.createAbsolutePath(file);

    return _.remove(this.items, item => item.file === file);
  }

  updateLanguage(file: string): Language {
    this.removeLanguages(file);
    return this.addLanguage(file);
  }

  private createAbsolutePath(file: string): string {
    return path.resolve(file);
  }

  save() {
    this.items.forEach(language => language.save());
  }

  addMessage(message: string, value: any) {
    this.items.forEach(language => {
      language.translate(message, value);
      language.save();
    });
  }

}
