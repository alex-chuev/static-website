import { State } from '../state';
import * as path from 'path';
import { copySync, existsSync } from 'fs-extra';

export function copyAssets(state: State) {
  const folder = path.join(state.options.src.folder, state.options.assets.folder);

  if (existsSync(folder)) {
    copySync(folder, state.options.dist.folder);
  }
}
