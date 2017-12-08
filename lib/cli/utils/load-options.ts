import { existsSync, readJsonSync } from 'fs-extra';
import * as _ from 'lodash';
import { Options } from '../../interfaces/options';
import { defaultOptions } from '../../default-options';

export function loadOptions(file = 'static-website.json'): Options {
  return existsSync(file) ? _.defaultsDeep(readJsonSync(file), defaultOptions) : defaultOptions;
}
