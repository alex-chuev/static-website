import * as glob from 'glob';
import * as path from 'path';

import { Translation } from '../interfaces/translation';
import { readJsonSync } from 'fs-extra';
import { Options } from '../interfaces/options';

export function getTranslations(options: Options): Translation[] {
  const pattern = path.join(
    options.src.folder,
    options.translations.folder,
    `*.${options.translations.extension}`,
  );

  return glob.sync(pattern)
    .map(file => process(file, readJsonSync(file), options));
}

function process(file: string, translation: Translation, options: Options): Translation {
  const language = path.parse(file).name;

  translation.language = language;
  translation.languageUrlPart = language === options.translations.defaultLanguage ? '' : language;

  return translation;
}
