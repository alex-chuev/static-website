import * as _ from 'lodash';

import { Options } from './interfaces/options';
import { renderCss } from './render-css';
import { renderJavascript } from './render-javascript';
import { renderHtml } from './render-html';
import { Code } from './interfaces/code';
import { loadTranslations } from './load-translations';
import { Codes } from './interfaces/codes';
import { getPages } from './utils/get-pages';

export function renderPages(options: Options): string[] {
  const pages = getPages(options);
  const translations = loadTranslations(options);

  if (options.verbose) {
    console.info(`Rendering ${pages.length} pages for ${translations.length} languages:`);
  }

  return _.flatMap(pages, page => {
    const css: Code = renderCss(page, options);
    const javascript: Code = renderJavascript(page, options);
    const codes: Codes = {css, js: javascript};

    return translations.map(translation => renderHtml(page, translation, codes, options));
  });
}
