import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import { Environment } from '../interfaces/environment';
import { getConfig } from './config';
import { build } from './build';
import * as path from 'path';
import { copyAssets } from './assets';

export function serve() {
  const config = getConfig();
  const environment: Environment = {
    production: false,
  };
  const browserSync = create();

  build(config, environment)
    .then(() => {
      browserSync.init({
        server: {
          baseDir: config.dist.folder,
        }
      });

      chokidar.watch(path.join(config.src.folder, config.assets.folder, `**/*`))
        .on('change', event => {
          copyAssets(config);
          browserSync.reload(event);
        });
    });
}
