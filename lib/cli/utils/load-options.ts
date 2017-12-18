import { existsSync, readJsonSync } from 'fs-extra';
import * as _ from 'lodash';
import { Config } from '../../interfaces/config';
import { defaultConfig } from '../../default-options';
import ReadWriteStream = NodeJS.ReadWriteStream;
import * as map from 'map-stream';

export function loadOptions(file = 'static-website.json'): Config {
  return existsSync(file) ? _.defaultsDeep(readJsonSync(file), defaultConfig) : defaultConfig;
}

export const createConfig = map((file, cb): ReadWriteStream => cb(parseConfig(file)));

function parseConfig(file): Config {
  return _.defaultsDeep(JSON.parse(file.contents.toString()), defaultConfig);
}
