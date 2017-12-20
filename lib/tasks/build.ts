import { Environment } from '../interfaces/environment';
import { Config } from '../interfaces/config';
import { copySync, emptyDirSync, pathExistsSync } from 'fs-extra';
import { createBuildCache } from './cache';
import * as path from 'path';

export async function build(config: Config, environment: Environment): Promise<void> {
  const cache = createBuildCache(config, environment);

  if (config.dist.clean) {
    emptyDirSync(config.dist.folder);
  }

  if (pathExistsSync(path.join(config.src.folder, config.assets.folder))) {
    copySync(path.join(config.src.folder, config.assets.folder), config.dist.folder);
  }
}
