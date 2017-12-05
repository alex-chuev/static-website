import * as path from 'path';
import { copySync, existsSync } from 'fs-extra';
import { Options } from '../interfaces/options';

export function copyAssets(options: Options) {
  const folder = path.join(options.src.folder, options.assets.folder);

  if (existsSync(folder)) {
    copySync(folder, options.dist.folder);
  }
}
