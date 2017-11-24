import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

import { Options } from './interfaces/options';
import { Translation } from './interfaces/translation';

export function loadTranslations(options: Options): Translation[] {
  const pattern = path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`);

  return glob.sync(pattern).map(file => load(file));
}

function load(file: string): Translation {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'));

  json.language = path.parse(file).name;

  return json;
}
