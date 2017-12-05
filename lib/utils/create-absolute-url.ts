import * as path from 'path';
import { Options } from '../interfaces/options';
import { Url } from '../types';

const indexRegExp = /index\.html$/g;
const slashRegExp = /\\/g;

export function createAbsoluteUrl(url: Url, options: Options): Url {
  return path.join(options.dist.url, url.replace(indexRegExp, '')).replace(slashRegExp, '/');
}
