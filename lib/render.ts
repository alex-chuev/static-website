import * as fs from 'fs-extra';

import { defaultOptions } from './default-options';
import { Options } from './interfaces/options';
import { PartialOptions } from './interfaces/partial-options';
import { renderPages } from './render-pages';
import { renderSitemap } from './render-sitemap';

export function render(partialOptions?: PartialOptions) {
  const options = prepareOptions(partialOptions);

  if (options.dist.clean) {
    cleanDistFolder(options);
  }

  const pages = renderPages(options);

  if (options.sitemap.generate) {
    renderSitemap(pages, options);
  }

  if (options.verbose) {
    console.info(`Rendered ${pages.length} page files.`);
  }
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
  fs.removeSync(options.dist.folder);
}
