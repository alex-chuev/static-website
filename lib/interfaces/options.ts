import { Translation } from './translation';
import { Renderer } from './renderer';

export interface Options {
  translations: Translation[],
  defaultTranslation: Translation,
  pagesFolder: string,
  pagesExtension: string,
  styleExtension: string,
  scriptExtension: string,
  htmlExtension: string,
  distFolder: string,
  distEncoding: string,
  cleanDistFolder: boolean,
  renderer: Renderer,
  verbose: boolean,
  rootUrl: string,
}
