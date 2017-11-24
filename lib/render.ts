import * as fs from 'fs-extra';

import { defaultOptions } from './default-options';
import { Options } from './interfaces/options';
import { PartialOptions } from './interfaces/partial-options';
import { renderPages } from './render-pages';
import { renderSitemap } from './render-sitemap';
import { getPages } from './utils/get-pages';
import { getTranslations } from './utils/get-translations';

export function render(partialOptions?: PartialOptions) {
  const options = getOptions(partialOptions);

  if (options.dist.clean) {
    cleanDistFolder(options);
  }

  const translations = getTranslations(options);
  const pages = getPages(options);

  const styles = compileStyles(options);
  const scripts = compileScripts(options);

  renderPages(pages, translations, options);

  if (options.sitemap.generate) {
    renderSitemap(pages, translations, options);
  }
}

function getOptions(partialOptions: PartialOptions): Options {
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
  fs.removeSync(options.dist.folder);
}

function compileStyles(options: Options) {
}

function compileScripts(options: Options) {
}
