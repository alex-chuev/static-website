import * as path from 'path';

import { Translation } from '../interfaces/translation';
import { PagesCompilerData } from '../interfaces/pages-compiler-data';
import { Codes } from '../interfaces/codes';
import { State } from '../state';
import { FilePath } from '../types';
import { createLink } from '../helpers/create-link';
import { createUrl } from '../helpers/create-url';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { ParsedPath } from 'path';

export function renderPageTemplate(page: FilePath, translation: Translation, codes: Codes, state: State) {
  const pagePath = path.join(state.options.pages.folder, `${page}.${state.options.pages.extension}`);
  const distPath = path.join(translation.languageUrlPart, page + '.html');
  const helpers = {
    link,
    languageLink,
    url,
    languageUrl,
  };
  const compilerOptions: PagesCompilerData = {
    ...translation,
    ...codes,
    ...helpers,
  };
  const parsedPagePath: ParsedPath = path.parse(page);

  state.compilers.templates.compileFile(pagePath, compilerOptions, distPath);

  function link(): string {
    return '';
  }

  function languageLink(): string {
    return '';
  }

  function languageUrl(language: string): string {
    const languageUrl = language === state.options.translations.defaultLanguage ? '' : language;
    return url(getCurrentPageUrl(), languageUrl);
  }

  function url(page: string, languageUrlPart = translation.languageUrlPart): string {
    return createAbsoluteUrl(path.join(languageUrlPart, page), state.options);
  }

  function getCurrentPageUrl(): string {
    return parsedPagePath.base === 'index' ? parsedPagePath.dir : `${page}.html`;
  }
}
