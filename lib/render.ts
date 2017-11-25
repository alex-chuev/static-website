import * as fs from 'fs-extra';

import { defaultOptions } from './default-options';
import { Options } from './interfaces/options';
import { PartialOptions } from './interfaces/partial-options';
import { renderPages } from './render-pages';
import { renderSitemap } from './render-sitemap';
import { getPages } from './utils/get-pages';
import { getTranslations } from './utils/get-translations';
import { CompilersFactory } from './factories/compilers-factory';
import { Compilers } from './interfaces/compilers';
import * as path from 'path';
import { createAbsoluteUrl } from './utils/create-absolute-url';

export function render(partialOptions?: PartialOptions) {
  const options = getOptions(partialOptions);

  if (options.dist.clean) {
    cleanDistFolder(options);
  }

  const translations = getTranslations(options);
  const pages = getPages(options);

  if (options.verbose) {
    console.info(`Rendering ${pages.length} pages for ${translations.length} languages:`);
  }

  const compilers = CompilersFactory.createCompilers(options);

  const styles = compileGlobalStyles(options, compilers);
  const scripts = compileGlobalScripts(options, compilers);

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

function compileGlobalStyles(options: Options, compilers: Compilers): string {
  const srcPath = path.join(options.styles.folder, `index.${options.styles.extension}`);
  const distPath = `index.css`;
  const distUrl = createAbsoluteUrl(distPath, options);

  compilers.styles.compileFile(srcPath, null, distPath);

  return distUrl;
}

function compileGlobalScripts(options: Options, compilers: Compilers): string {
  const srcPath = path.join(options.scripts.folder, `index.${options.scripts.extension}`);
  const distPath = `index.js`;
  const distUrl = createAbsoluteUrl(distPath, options);

  compilers.scripts.compileFile(srcPath, null, distPath);

  return distUrl;
}
