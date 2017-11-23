import { Translation } from './translation';
import { PagesCompiler } from './pages-compiler';
import { StylesCompiler } from './styles-compiler';
import { ScriptsCompiler } from './scripts-compiler';
import { ScriptsCompilerOptions } from './scripts-compiler-options';

export interface Options {
  src: {
    folder: string,
  },
  translations: {
    folder: string,
    defaultLanguage: string,
    extension: string,
  },
  pagesFolder: string,
  pagesExtension: string,
  pagesCompiler: PagesCompiler,
  stylesExtension: string,
  stylesCompiler: StylesCompiler,
  scriptsExtension: string,
  scriptsCompiler: ScriptsCompiler,
  scriptsCompilerOptions: ScriptsCompilerOptions,
  htmlExtension: string,
  distFolder: string,
  distEncoding: string,
  cleanDistFolder: boolean,
  verbose: boolean,
  rootUrl: string,
}
