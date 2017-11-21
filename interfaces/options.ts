import { Translation } from './translation';
import { Renderer } from './renderer';

export interface Options {
  translations: Translation[],
  defaultTranslation: Translation,
  pagesFolder: string,
  pagesExtension: string,
  distFolder: string,
  distExtension: string,
  distEncoding: string,
  cleanDistFolder: boolean,
  renderer: Renderer,
}
