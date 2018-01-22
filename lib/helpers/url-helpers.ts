import { AppConfig } from '../entities/app/app-config';
import { Url } from '../types';

const indexRegExp = /index\.html$/g;
const slashRegExp = /\\/g;
const headSlashRegExp = /^\//g;

export class UrlHelpers {

  static createAbsoluteUrl(relativeUrl: Url, config: AppConfig): Url {
    return config.dist.url + relativeUrl
      .replace(indexRegExp, '')
      .replace(slashRegExp, '/')
      .replace(headSlashRegExp, '');
  }

}
