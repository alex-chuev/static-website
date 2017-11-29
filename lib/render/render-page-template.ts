import * as path from 'path';

import { Translation } from '../interfaces/translation';
import { PagesCompilerData } from '../interfaces/pages-compiler-data';
import { Codes } from '../interfaces/codes';
import { State } from '../state';
import { FilePath } from '../types';
import { TemplateHelpersFactory } from '../factories/template-helpers-factory';

export function renderPageTemplate(page: FilePath, translation: Translation, codes: Codes, state: State) {
  const templatePath = path.join(state.options.pages.folder, `${page}.${state.options.pages.extension}`);
  const distPath = path.join(translation.languageUrlPart, page + '.html');
  const helpers = TemplateHelpersFactory.createTemplateHelpers(page, translation, state.options);
  const compilerOptions: PagesCompilerData = {
    ...translation,
    ...codes,
    ...helpers,
  };

  state.compilers.templates.compileFile(templatePath, compilerOptions, distPath);
}
