import { Options } from '../interfaces/options';
import { defaultRenderer } from './default-renderer';

export const defaultOptions: Options = {
  translations: [],
  defaultTranslation: null,
  pagesFolder: 'pagesFolder',
  pagesExtension: 'pug',
  distFolder: 'distFolder',
  distExtension: 'html',
  distEncoding: 'utf-8',
  cleanDistFolder: true,
  renderer: defaultRenderer,
};
