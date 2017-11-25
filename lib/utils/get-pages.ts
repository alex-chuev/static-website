import * as path from 'path';
import * as glob from 'glob';

import { Options } from '../interfaces/options';
import { FilePath } from '../types';

export function getPages(options: Options): FilePath[] {
  const pattern = `**/*.${options.pages.extension}`;
  const extensionRegexp = new RegExp(`\.${options.pages.extension}$`);

  return glob.sync(pattern, {
    cwd: path.join(options.src.folder, options.pages.folder),
  }).map(page => page.replace(extensionRegexp, ''));
}
