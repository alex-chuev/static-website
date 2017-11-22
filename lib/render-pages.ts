import * as glob from 'glob';

import { Options } from '../interfaces/options';
import { renderCss } from './render-css';
import { renderJavascript } from './render-javascript';
import { renderHtml } from './render-html';
import { Code } from '../interfaces/code';

export function renderPages(options: Options) {
  const pages = getPages(options);

  if (pages.length && options.verbose) {
    console.log(`Rendering ${pages.length} pages for ${options.translations.length} languages:`);
  }

  pages.forEach(page => {
    const css: Code = renderCss(page, options);
    const javascript: Code = renderJavascript(page, options);

    options.translations.forEach(translation => {
      renderHtml(page, translation, {css, javascript}, options);
    });
  });

  if (options.verbose) {
    console.log(`Rendered ${pages.length * options.translations.length} files.`);
  }
}

function getPages(options: Options) {
  const pattern = `**/*.${options.pagesExtension}`;
  const pages = glob.sync(pattern, {
    cwd: options.pagesFolder,
  });

  return removePageExtensions(pages, options);
}

function removePageExtensions(pages: string[], options: Options): string[] {
  const extensionRegexp = new RegExp(`/\.${options.pagesExtension}$/`);

  return pages.map(page => page.replace(extensionRegexp, ''));
}
