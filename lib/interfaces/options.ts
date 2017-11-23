import { Translation } from './translation';
import { PagesCompiler } from './pages-compiler';
import { StylesCompiler } from './styles-compiler';

export interface Options {
  translations: Translation[],
  defaultTranslation: Translation,
  pagesFolder: string,
  pagesExtension: string,
  pagesCompiler: PagesCompiler,
  stylesExtension: string,
  stylesCompiler: StylesCompiler,
  scriptExtension: string,
  htmlExtension: string,
  distFolder: string,
  distEncoding: string,
  cleanDistFolder: boolean,
  verbose: boolean,
  rootUrl: string,
}
