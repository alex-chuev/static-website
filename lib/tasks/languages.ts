import * as path from 'path';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';
import * as glob from 'glob';

export function getLanguages(config: Config): Language[] {
  return glob.sync(path.join(config.src.folder, config.translations.folder, `*.${config.translations.extension}`))
    .map(file => getLanguage(file, config));
}

export function getLanguage(file: string, config: Config): Language {
  return new Language(file, config);
}

export function updateLanguages(languages: Language[]) {
  languages.forEach(language => language.save());
}
