import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

import { Translation } from '../interfaces/translation';
import { defaultOptions } from './default-options';
import { Options } from '../interfaces/options';
import { PartialOptions } from '../interfaces/partial-options';

export function render(options: PartialOptions = defaultOptions) {
  if (defaultOptions !== options) {
    options = Object.assign({}, defaultOptions, options);
  }

  if (options.cleanDistFolder) {
    cleanDistFolder(options);
  }

  getPages(options).forEach(page => {
    options.translations.forEach(translation => {
      const html = options.renderer(path.join(options.pagesFolder, page), translation);

      saveFile(page, html, translation, options);
    });
  });
}

function cleanDistFolder(options: Options) {
  fs.removeSync(options.distFolder);
}

function getPages(options: Options) {
  const pattern = `**/*.${options.pagesExtension}`;

  return glob.sync(pattern, {
    cwd: options.pagesFolder,
  });
}

function saveFile(page: string, html: string, translation: Translation, options: Options) {
  const languagePart = translation === options.defaultTranslation ? '' : translation.language;
  const distPath = path.join(
    options.distFolder,
    languagePart,
    page.replace('.' + options.pagesExtension, '.' + options.distExtension),
  );

  fs.outputFileSync(distPath, html, options.distEncoding);
}
