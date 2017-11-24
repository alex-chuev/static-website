import { Options } from '../interfaces/options';
import * as path from 'path';

const regexp = /\\/g;

export function createAbsoluteUrl(url: string, options: Options): string {
  return path.join(options.dist.url, url).replace(regexp, '/');
}
