import * as _ from 'lodash';
import { existsSync, readJsonSync } from 'fs-extra';
import { Config } from '../interfaces/config';
import { defaultConfig } from '../default-options';

export function getConfig(file = 'static-website.json'): Config {
  return existsSync(file) ? _.defaultsDeep(readJsonSync(file), defaultConfig) : defaultConfig;
}
