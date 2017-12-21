import * as path from 'path';
import { Config } from '../interfaces/config';
import { copySync, pathExistsSync } from 'fs-extra';

export function copyAssets(config: Config) {
  if (pathExistsSync(path.join(config.src.folder, config.assets.folder))) {
    copySync(path.join(config.src.folder, config.assets.folder), config.dist.folder);
  }
}
