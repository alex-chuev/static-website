import * as _ from 'lodash';
import { ConfigData } from '../../interfaces/config-data';

export class AppConfigDefaults implements ConfigData {

  src = {
    folder: 'src',
  };
  assets = {
    folder: 'assets',
  };
  translations = {
    folder: 'languages',
    defaultLanguage: 'en',
    extension: 'json',
  };
  pages = {
    folder: 'pages',
    extension: 'pug',
  };
  styles = {
    extension: 'styl',
    folder: 'styles',
  };
  scripts = {
    extension: 'ts',
    folder: 'scripts',
  };
  dist = {
    folder: 'dist',
    encoding: 'utf-8',
    clean: true,
    url: '/',
  };
  serve = {
    host: 'localhost',
    port: 5000,
    open: true,
  };
  sitemap = {
    hostname: '',
  };

  constructor(data?: any) {
    if (data) {
      _.merge(this, data);
    }
  }

}
