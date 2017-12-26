import { existsSync, readJsonSync } from 'fs-extra';
import { Config } from '../entities/config';

export function getConfig(file = 'static-website.json'): Config {
  return existsSync(file) ? new Config(readJsonSync(file)) : new Config();
}
