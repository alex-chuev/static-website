export interface ConfigData {
  src: {
    folder: string,
  };
  assets: {
    folder: string,
  };
  translations: {
    folder: string,
    defaultLanguage: string,
    extension: string,
  };
  pages: {
    folder: string,
    extension: string,
  };
  styles: {
    extension: string,
    folder: string,
  };
  scripts: {
    extension: string,
    folder: string,
  };
  dist: {
    folder: string,
    encoding: string,
    url: string,
    clean: boolean,
  };
  serve: {
    host: string,
    port: number,
    open: boolean,
  };
  sitemap: {
    hostname: string,
  };
}
