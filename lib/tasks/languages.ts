import * as path from 'path';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';
import * as glob from 'glob';
import { readJsonSync } from 'fs-extra';

export function getLanguages(config: Config): Language[] {
  return glob.sync(path.join(config.src.folder, config.translations.folder, `*.${config.translations.extension}`))
    .map(file => {
      const name = path.parse(file).name;
      const translation = readJsonSync(file);

      return new Language(name, translation, config);
    });
}
