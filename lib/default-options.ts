import { Options } from './interfaces/options';

export const defaultOptions: Options = {
  src: {
    folder: 'src',
  },
  assets: {
    folder: 'assets',
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
        target: 'es5',
      },
    },
  },
  dist: {
    folder: 'dist',
    encoding: 'utf-8',
    clean: true,
    url: '/',
  },
  serve: {
    host: 'localhost',
    port: 5000,
    open: true,
  },
  sitemap: {
    generate: true,
  },
  verbose: true,
};
