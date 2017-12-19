import { Config } from './interfaces/config';

export const defaultConfig: Config = {
  verbose: true,
  src: {
    folder: 'src',
  },
  assets: {
    folder: 'assets',
  },
  translations: {
    folder: 'languages',
    defaultLanguage: 'en',
    extension: 'json',
    generate: true,
  },
  pages: {
    folder: 'pages',
    extension: 'pug',
  },
  styles: {
    extension: 'styl',
    folder: 'styles',
  },
  scripts: {
    extension: 'ts',
    folder: 'scripts',
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
    domain: '',
  },
};
