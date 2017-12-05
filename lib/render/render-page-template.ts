import * as path from 'path';

import { Language } from '../entities/language';
import { PagesCompilerData } from '../interfaces/pages-compiler-data';
import { Codes } from '../interfaces/codes';
import { State } from '../state';
import { FilePath } from '../types';
import { TemplateHelpersFactory } from '../factories/template-helpers-factory';

export function renderPageTemplate(page: FilePath, language: Language, codes: Codes, state: State) {
  const templatePath = path.join(state.options.pages.folder, `${page}.${state.options.pages.extension}`);
  const distPath = path.join(language.url, page + '.html');
  const helpers = TemplateHelpersFactory.createTemplateHelpers(page, language, state.options);
  const otherLanguages = state.languages.filter(item => item !== language);
  const compilerOptions: PagesCompilerData = {
    language,
    otherLanguages,
    environment: state.environment,
    ...codes,
    ...helpers,
  };

  state.compilers.templates.compileFile(templatePath, compilerOptions, distPath);
}
