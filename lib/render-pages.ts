import { Options } from './interfaces/options';
import { renderCss } from './render-css';
import { renderJavascript } from './render-javascript';
import { renderHtml } from './render-html';
import { Code } from './interfaces/code';
import { Codes } from './interfaces/codes';
import { Translation } from './interfaces/translation';

export function renderPages(pages: string[], translations: Translation[], options: Options) {
  if (options.verbose) {
    console.info(`Rendering ${pages.length} pages for ${translations.length} languages:`);
  }

  pages.forEach(page => {
    const css: Code = renderCss(page, options);
    const javascript: Code = renderJavascript(page, options);
    const codes: Codes = {css, js: javascript};

    return translations.forEach(translation => renderHtml(page, translation, codes, options));
  });
}
