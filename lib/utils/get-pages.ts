import * as path from 'path';
import * as glob from 'glob';

import { Options } from '../interfaces/options';

export function getPages(options: Options) {
  const pattern = `**/*.${options.pages.extension}`;
  const pages = glob.sync(pattern, {
    cwd: path.join(options.src.folder, options.pages.folder),
  });

  return removePageExtensions(pages, options);
}

function removePageExtensions(pages: string[], options: Options): string[] {
  const extensionRegexp = new RegExp(`\.${options.pages.extension}$`);

  return pages.map(page => page.replace(extensionRegexp, ''));
}
