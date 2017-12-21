import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import { build } from './build';
import * as path from 'path';
import { copyAsset, unlinkAsset } from './assets';
import { createBuildCache } from './cache';

export function serve() {
  const cache = createBuildCache({
    production: false,
  });

  build(cache);

  const browserSync = create();
  browserSync.init({
    server: {
      baseDir: cache.config.dist.folder,
    },
    files: path.join(cache.config.dist.folder, '**/*'),
    watchOptions: {
      ignoreInitial: true,
    },
    reloadDebounce: 200,
  });

  chokidar.watch(path.join(cache.config.src.folder, cache.config.assets.folder, `**/*`), {ignoreInitial: true})
    .on('add', file => copyAsset(file, cache))
    .on('change', file => copyAsset(file, cache))
    .on('unlink', file => unlinkAsset(file, cache));
}
