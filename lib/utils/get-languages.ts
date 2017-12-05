import * as glob from 'glob';
import * as path from 'path';
import { readJsonSync } from 'fs-extra';

import { Options } from '../interfaces/options';
import { Language } from '../entities/language';

export function getLanguages(options: Options): Language[] {
  const pattern = path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`);

  return glob.sync(pattern)
    .map(file => new Language(path.parse(file).name, readJsonSync(file), options));
}
