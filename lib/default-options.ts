import { Options } from './interfaces/options';

export const defaultOptions: Options = {
  src: {
    folder: ''
  },
  assets: {
    folder: 'assets'
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
    folder: 'styles',
    extension: 'styl',
  },
  scripts: {
    folder: 'scripts',
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
    url: '/',
  },
  sitemap: {
    generate: true,
  },
  verbose: true,
};
