import * as path from 'path';

import { Options } from './interfaces/options';
import { Translation } from './interfaces/translation';
import { PagesCompilerOptions } from './interfaces/pages-compiler-options';
import { Codes } from './interfaces/codes';
import { PugCompiler } from './compilers/pages/pug-compiler';
import { Compiler } from './compilers/compiler';

export function renderHtml(page: string, translation: Translation, codes: Codes, options: Options) {
  const compilerOptions: PagesCompilerOptions = {...translation, ...codes};
  const pagePath = path.join(options.pages.folder, `${page}.${options.pages.extension}`);
  const compiler = getCompiler(options);
  const languagePart = translation.language === options.translations.defaultLanguage ? '' : translation.language;
  const distPath = path.join(languagePart, page + '.html');

  compiler.compileFile(pagePath, compilerOptions, distPath);
}

function getCompiler(options: Options): Compiler {
  switch (options.pages.extension) {
    case 'pug':
    default:
      return new PugCompiler(options);
  }
}
