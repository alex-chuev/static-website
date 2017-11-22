import * as path from 'path';

import { Options } from './interfaces/options';
import { Translation } from './interfaces/translation';
import { Code } from './interfaces/code';
import { dist } from './utils/dist';

export function renderHtml(page: string, translation: Translation, code: { css: Code, javascript: Code }, options: Options) {
  const html = options.renderer(path.join(options.pagesFolder, page), {
    ...translation,
    code,
  });

  distHtml(page, html, translation, options);
}

function distHtml(page: string, html: string, translation: Translation, options: Options) {
  const languagePart = translation === options.defaultTranslation ? '' : translation.language;
  const distPath = path.join(languagePart, page + '.' + options.htmlExtension);

  dist(distPath, html, options);
}
