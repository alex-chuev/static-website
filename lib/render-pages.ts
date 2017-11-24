import * as glob from 'glob';

import { Options } from './interfaces/options';
import { renderCss } from './render-css';
import { renderJavascript } from './render-javascript';
import { renderHtml } from './render-html';
import { Code } from './interfaces/code';
import { loadTranslations } from './load-translations';

export function renderPages(options: Options) {
  const pages = getPages(options);
  const translations = loadTranslations(options);

  if (options.verbose) {
    console.info(`Rendering ${pages.length} pages for ${translations.length} languages:`);
  }

  pages.forEach(page => {
    const css: Code = renderCss(page, options);
    const javascript: Code = renderJavascript(page, options);

    translations.forEach(translation => {
      renderHtml(page, translation, {css, javascript}, options);
    });
  });

  if (options.verbose) {
    console.info(`Rendered ${pages.length * translations.length} page files.`);
  }
}

function getPages(options: Options) {
  const pattern = `**/*.${options.pages.extension}`;
  const pages = glob.sync(pattern, {
    cwd: options.pages.folder,
  });

  return removePageExtensions(pages, options);
}

function removePageExtensions(pages: string[], options: Options): string[] {
  const extensionRegexp = new RegExp(`\.${options.pages.extension}$`);

  return pages.map(page => page.replace(extensionRegexp, ''));
}
