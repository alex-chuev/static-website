import { Config } from '../interfaces/config';
import { Url } from '../types';

const indexRegExp = /index\.html$/g;
const slashRegExp = /\\/g;
const headSlashRegExp = /^\//g;

export function createAbsoluteUrl(relativeUrl: Url, config: Config): Url {
  return config.dist.url + relativeUrl
    .replace(indexRegExp, '')
    .replace(slashRegExp, '/')
    .replace(headSlashRegExp, '');
}
