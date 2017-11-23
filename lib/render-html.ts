import * as path from 'path';
import * as fs from 'fs-extra';

import { Options } from './interfaces/options';
import { Translation } from './interfaces/translation';
import { dist } from './utils/dist';
import { PagesCompilerOptions } from './interfaces/pages-compiler-options';
import { Codes } from './interfaces/codes';

export function renderHtml(page: string, translation: Translation, codes: Codes, options: Options) {
  const compilerOptions: PagesCompilerOptions = {...translation, ...codes};
  const pagePath = path.join(options.pagesFolder, `${page}.${options.pagesExtension}`);

  distHtml(page, compile(pagePath, compilerOptions, options), translation, options);
}

function compile(filename: string, compilerOptions: PagesCompilerOptions, options: Options): string {
  const source = fs.readFileSync(filename, 'utf8');

  return options.pagesCompiler(source, compilerOptions);
}

function distHtml(page: string, html: string, translation: Translation, options: Options) {
  const languagePart = translation.language === options.translations.defaultLanguage ? '' : translation.language;
  const distPath = path.join(languagePart, page + '.' + options.htmlExtension);

  dist(distPath, html, options);
}
