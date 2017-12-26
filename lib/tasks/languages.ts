import { Language } from '../entities/language';
import { Config } from '../entities/config';
import * as glob from 'glob';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';

export function getLanguages(config: Config): Language[] {
  return glob.sync(config.translationsGlob)
    .map(file => getLanguage(file, config));
}

export function getLanguage(file: string, config: Config): Language {
  return new Language(file, config);
}

export function updateLanguages(languages: Language[]) {
  languages.forEach(language => language.save());
}

export function onTranslationsWatchEvent(event: WatchEvent) {
  switch (event.action) {
    case WatchAction.Add:
    case WatchAction.Change:
    case WatchAction.Unlink:
      break;
  }
}
