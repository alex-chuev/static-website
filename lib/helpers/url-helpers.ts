import { Config } from '../interfaces/config';
import { Url } from '../types';

const indexRegExp = /index\.html$/g;
const slashRegExp = /\\/g;
const headSlashRegExp = /^\//g;

export function createAbsoluteUrl(relativeUrl: Url, options: Config): Url {
  return options.dist.url + relativeUrl
    .replace(indexRegExp, '')
    .replace(slashRegExp, '/')
    .replace(headSlashRegExp, '');
}
