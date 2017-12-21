import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import { copyAsset, getAssetsGlob, unlinkAsset } from './assets';
import { createApp } from './app';
import { getGlobalJs, getPageJs } from './scripts';
import { saveExternalCss, saveExternalJs } from './code';
import { getGlobalCss, getPageCss } from './styles';
import { getLanguages, getTranslationsGlob } from './languages';
import { getPages } from './pages';

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

  chokidar.watch(getAssetsGlob(app.config), {ignoreInitial: true})
    .on('add', file => copyAsset(file, app))
    .on('change', file => copyAsset(file, app))
    .on('unlink', file => unlinkAsset(file, app));

  chokidar.watch(path.join(app.config.src.folder, app.config.scripts.folder, `**/*.${app.config.scripts.extension}`), {ignoreInitial: true})
    .on('change', file => {
      app.inlineJs = getGlobalJs(app.config, app.environment, true);
      app.externalJs = getGlobalJs(app.config, app.environment);
      saveExternalJs(app);
    });

  chokidar.watch(path.join(app.config.src.folder, app.config.styles.folder, `**/*.${app.config.styles.extension}`), {ignoreInitial: true})
    .on('change', file => {
      app.inlineCss = getGlobalCss(app.config, app.environment, true);
      app.externalCss = getGlobalCss(app.config, app.environment);
      saveExternalCss(app);
    });

  chokidar.watch(getTranslationsGlob(app.config), {ignoreInitial: true})
    .on('change', file => {
      app.languages = getLanguages(app.config);
      app.buildPages(app.pages, app.languages);
    });

  chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.pages.extension}`), {ignoreInitial: true})
    .on('change', file => {
      app.pages = getPages(app.config);
      app.buildPages(app.pages, app.languages);
    });

  chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.styles.extension}`), {ignoreInitial: true})
    .on('change', file => {
      app.pageInlineCss = getPageCss(app.config, app.environment, app.pages, true);
      app.pageExternalCss = getPageCss(app.config, app.environment, app.pages);

      app.buildPages(app.pages, app.languages);
    });

  chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.scripts.extension}`), {ignoreInitial: true})
    .on('change', file => {
      app.pageInlineJs = getPageJs(app.config, app.environment, app.pages, true);
      app.pageExternalJs = getPageJs(app.config, app.environment, app.pages);

      app.buildPages(app.pages, app.languages);
    });
}
