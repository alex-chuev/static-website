import * as _ from 'lodash';
import * as glob from 'glob';
import { Language } from './language';
import { AppConfig } from './app-config';
import * as path from 'path';

export class AppLanguages {

  items: Language[] = [];

  constructor(private config: AppConfig) {
    glob.sync(this.config.translationsGlob)
      .forEach(file => this.addLanguage(path.resolve(file)));
  }

  addLanguage(absolutePath: string): Language {
    const language = new Language(absolutePath, this.config);
    this.items.push(language);
    return language;
  }

  removeLanguages(absolutePath: string): Language[] {
    return _.remove(this.items, item => item.absolutePath === absolutePath);
  }

  updateLanguage(absolutePath: string): Language {
    this.removeLanguages(absolutePath);
    return this.addLanguage(absolutePath);
  }

  addMessage(message: string, value: any) {
    this.items.forEach(language => {
      language.translate(message, value);
      language.saveUpdated();
    });
  }

}
