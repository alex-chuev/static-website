import { ScriptsCompilerOptions } from './scripts-compiler-options';

export interface Options {
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
  sitemap: {
    generate: boolean,
  },
  verbose: boolean,
}
