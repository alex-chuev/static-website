import * as _ from 'lodash';
import * as glob from 'glob';
import { Language } from '../language';
import { AppConfig } from './app-config';
import { FileObject } from '../file-object';

export class AppLanguages {

  items: Language[] = [];

  constructor(private config: AppConfig) {
    glob.sync(this.config.translationsGlob)
      .map(filePath => new FileObject(filePath))
      .map(file => this.addLanguage(file));
  }

  addLanguage(file: FileObject): Language {
    const language = new Language(file, this.config);
    this.items.push(language);
    return language;
  }

  removeLanguage(file: FileObject): Language {
    return _.first(_.remove(this.items, item => item.file.absolutePath === file.absolutePath));
  }

  getLanguage(file: FileObject): Language {
    return this.items.find(item => item.file.absolutePath === file.absolutePath);
  }

  addMessage(message: string, value: any) {
    this.items.forEach(language => language.addMessage(message, value));
  }

}
