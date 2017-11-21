import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

import { Translation } from '../interfaces/translation';
import { defaultOptions } from './default-options';
import { Options } from '../interfaces/options';
import { PartialOptions } from '../interfaces/partial-options';

export function render(partialOptions?: PartialOptions) {
  let options: Options = prepareOptions(partialOptions);

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

function prepareOptions(partialOptions: PartialOptions): Options {
  if (partialOptions) {
    return {
      ...defaultOptions,
      ...partialOptions,
    };
  } else {
    return defaultOptions;
  }
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
