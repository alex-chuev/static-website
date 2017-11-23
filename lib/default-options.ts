import { Options } from './interfaces/options';
import { compilePug } from './compilers/compile-pug';
import { compileStylus } from './compilers/compile-stylus';

export const defaultOptions: Options = {
  translations: [],
  defaultTranslation: null,
  pagesFolder: 'pages',
  pagesExtension: 'pug',
  pagesCompiler: compilePug,
  stylesExtension: 'styl',
  stylesCompiler: compileStylus,
  scriptExtension: 'ts',
  distFolder: 'dist',
  htmlExtension: 'html',
  distEncoding: 'utf-8',
  cleanDistFolder: true,
  verbose: true,
  rootUrl: '/',
};
