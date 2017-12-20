import * as gulp from 'gulp';
import { create } from 'browser-sync';
import { Environment } from '../interfaces/environment';
import { getConfig } from './config';
import { build } from './build';
import * as path from 'path';
import { promiseCopyAssets } from './assets';
import { onGlobalStyleFileChange, onPageStyleFileChange } from './styles';
import { onGlobalScriptFileChange, onPageScriptFileChange } from './scripts';

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

      gulp.watch(path.join(config.src.folder, config.assets.folder, `**/*`))
        .on('change', () => promiseCopyAssets(config).then(() => browserSync.reload()));

      gulp.watch(path.join(config.src.folder, config.styles.folder, `**/*.${config.styles.extension}`))
        .on('change', event => onGlobalStyleFileChange(config, event).then(file => browserSync.reload(file.path)));

      gulp.watch(path.join(config.src.folder, config.pages.folder, `**/*.${config.styles.extension}`))
        .on('change', event => onPageStyleFileChange(config, event).then(file => browserSync.reload(file.path)));

      gulp.watch(path.join(config.src.folder, config.scripts.folder, `**/*.${config.scripts.extension}`))
        .on('change', event => onGlobalScriptFileChange(config, event).then(file => browserSync.reload(file.path)));

      gulp.watch(path.join(config.src.folder, config.pages.folder, `**/*.${config.scripts.extension}`))
        .on('change', event => onPageScriptFileChange(config, event).then(file => browserSync.reload(file.path)));
    });
}
