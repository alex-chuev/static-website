import * as path from 'path';

import { Translation } from '../interfaces/translation';
import { PagesCompilerData } from '../interfaces/pages-compiler-data';
import { Codes } from '../interfaces/codes';
import { State } from '../state';
import { FilePath } from '../types';

export function renderPageTemplate(page: FilePath, translation: Translation, codes: Codes, state: State) {
  const pagePath = path.join(state.options.pages.folder, `${page}.${state.options.pages.extension}`);
  const distPath = path.join(translation.languageUrl, page + '.html');

  const compilerOptions: PagesCompilerData = {...translation, ...codes};

  state.compilers.templates.compileFile(pagePath, compilerOptions, distPath);
}
