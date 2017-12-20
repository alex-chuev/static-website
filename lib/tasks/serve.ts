import * as gulp from 'gulp';
import { create } from 'browser-sync';
import { Environment } from '../interfaces/environment';
import { getConfig } from './config';
import { build } from './build';
import * as path from 'path';
import { promiseCopyAssets } from './assets';
import { promiseCode } from './code';

export function serve(environment: Environment) {
  const config = getConfig();
  const browserSync = create();

  build(config, environment)
    .then(() => {
      browserSync.init({
        server: config.dist.folder
      });

      gulp.watch(path.join(config.src.folder, config.assets.folder, `**/*`))
        .on('change', () => promiseCopyAssets(config).then(() => browserSync.reload()));

      gulp.watch(path.join(config.src.folder, config.styles.folder, `**/*.${config.styles.extension}`))
        .on('change', () => promiseCode(config).then(() => browserSync.reload('main.css')));

      gulp.watch(path.join(config.src.folder, config.scripts.folder, `**/*.${config.scripts.extension}`))
        .on('change', () => promiseCode(config).then(() => browserSync.reload('main.js')));

      gulp.watch(path.join(config.src.folder, config.pages.folder, `**/*`))
        .on('change', () => build(config, environment).then(() => browserSync.reload()));
    });
}
