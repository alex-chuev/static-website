import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import { copyAsset, unlinkAsset } from './assets';
import { createApp } from './app';

export function serve() {
  const app = createApp({
    production: false,
  });

  app.build();

  const browserSync = create();
  browserSync.init({
    server: {
      baseDir: app.config.dist.folder,
    },
    files: path.join(app.config.dist.folder, '**/*'),
    watchOptions: {
      ignoreInitial: true,
    },
    reloadDebounce: 200,
  });

  chokidar.watch(path.join(app.config.src.folder, app.config.assets.folder, `**/*`), {ignoreInitial: true})
    .on('add', file => copyAsset(file, app))
    .on('change', file => copyAsset(file, app))
    .on('unlink', file => unlinkAsset(file, app));
}
