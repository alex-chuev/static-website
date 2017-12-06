import { ScriptsCompilerOptions } from './scripts-compiler-options';

export interface Options {
  verbose: boolean,
  src: {
    folder: string,
  },
  assets: {
    folder: string,
  },
  translations: {
    folder: string,
    defaultLanguage: string,
    extension: string,
    generate: boolean,
  },
  pages: {
    folder: string,
    extension: string,
  },
  styles: {
    folder: string,
    extension: string,
  },
  scripts: {
    folder: string,
    extension: string,
    options: ScriptsCompilerOptions,
  },
  dist: {
    folder: string,
    encoding: string,
    url: string,
    clean: boolean,
  },
  serve: {
    host: string,
    port: number,
    open: boolean,
  },
  sitemap: {
    generate: boolean,
  },
}
