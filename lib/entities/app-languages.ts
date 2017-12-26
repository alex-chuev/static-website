import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import * as glob from 'glob';
import { Language } from './language';
import { AppConfig } from './app-config';

export class AppLanguages {

  items: Language[] = [];

  constructor(private config: AppConfig) {
    glob.sync(this.config.translationsGlob)
      .map(file => new Language(file, this.config))
      .forEach(language => this.items.push(language));
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

  onWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
      case WatchAction.Unlink:
    }
  }

}
