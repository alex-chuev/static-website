import { Options } from './interfaces/options';

export const defaultOptions: Options = {
  src: {
    folder: ''
  },
  translations: {
    folder: 'translations',
    defaultLanguage: 'en',
    extension: 'json',
  },
  pages: {
    folder: 'pages',
    extension: 'pug',
  },
  styles: {
    extension: 'styl',
  },
  scripts: {
    extension: 'ts',
    options: {
      compilerOptions: {
        target: "es5",
      },
    },
  },
  dist: {
    folder: 'dist',
    encoding: 'utf-8',
    clean: true,
    url: 'utf-8',
  },
  verbose: true,
};
