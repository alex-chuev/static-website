import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import { copyAsset, unlinkAsset } from './assets';
import { createApp } from './app';
import { getGlobalJs } from './scripts';
import { saveExternalCss, saveExternalJs } from './code';
import { getGlobalCss } from './styles';

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

  chokidar.watch(path.join(app.config.src.folder, app.config.scripts.folder, `**/*`), {ignoreInitial: true})
    .on('change', file => {
      app.inlineJs = getGlobalJs(app.config, app.environment, true);
      app.externalJs = getGlobalJs(app.config, app.environment);
      saveExternalJs(app);
    });

  chokidar.watch(path.join(app.config.src.folder, app.config.styles.folder, `**/*`), {ignoreInitial: true})
    .on('change', file => {
      app.inlineCss = getGlobalCss(app.config, app.environment, true);
      app.externalCss = getGlobalCss(app.config, app.environment);
      saveExternalCss(app);
    });
}
