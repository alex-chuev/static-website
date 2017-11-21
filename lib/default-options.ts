import { Options } from '../interfaces/options';
import { defaultRenderer } from './default-renderer';

export const defaultOptions: Options = {
  translations: [],
  defaultTranslation: null,
  pagesFolder: 'pages',
  pagesExtension: 'pug',
  distFolder: 'dist',
  distExtension: 'html',
  distEncoding: 'utf-8',
  cleanDistFolder: true,
  renderer: defaultRenderer,
};
