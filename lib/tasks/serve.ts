import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import isInside from 'is-inside';
import { createApp } from './app';
import { WatchAction } from '../enums/watch-action';
import { WatchEvent } from '../interfaces/watch-event';
import { onAssetsWatchEvent } from './assets';
import { onScriptsWatchEvent } from './scripts';
import { onStylesWatchEvent } from './styles';
import { onTranslationsWatchEvent } from './languages';
import { onPagesWatchEvent } from './pages';

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

  chokidar.watch(path.join(app.config.src.folder, '**/*'))
    .on('add', file => onWatchEvent({app, file, action: WatchAction.Add}))
    .on('change', file => onWatchEvent({app, file, action: WatchAction.Change}))
    .on('unlink', file => onWatchEvent({app, file, action: WatchAction.Unlink}));

  // chokidar.watch(path.join(app.config.src.folder, app.config.scripts.folder, `**/*.${app.config.scripts.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.inlineJs = getGlobalJs(app.config, app.environment, true);
  //     app.externalJs = getGlobalJs(app.config, app.environment);
  //     saveExternalJs(app);
  //   });
  //
  // chokidar.watch(path.join(app.config.src.folder, app.config.styles.folder, `**/*.${app.config.styles.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.inlineCss = getGlobalCss(app.config, app.environment, true);
  //     app.externalCss = getGlobalCss(app.config, app.environment);
  //     saveExternalCss(app);
  //   });
  //
  // chokidar.watch(getTranslationsGlob(app.config), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.languages = getLanguages(app.config);
  //     app.buildPages(app.pages, app.languages);
  //   });
  //
  // chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.pages.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.pages = getPages(app.config);
  //     app.buildPages(app.pages, app.languages);
  //   });
  //
  // chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.styles.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.pageInlineCss = getPageCss(app.config, app.environment, app.pages, true);
  //     app.pageExternalCss = getPageCss(app.config, app.environment, app.pages);
  //
  //     app.buildPages(app.pages, app.languages);
  //   });
  //
  // chokidar.watch(path.join(app.config.src.folder, app.config.pages.folder, `**/*.${app.config.scripts.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.pageInlineJs = getPageJs(app.config, app.environment, app.pages, true);
  //     app.pageExternalJs = getPageJs(app.config, app.environment, app.pages);
  //
  //     app.buildPages(app.pages, app.languages);
  //   });
}

function onWatchEvent(event: WatchEvent) {
  if (isInside(event.file, event.app.config.assetsFolder)) {
    onAssetsWatchEvent(event);
  } else if (isInside(event.file, event.app.config.translationsFolder)) {
    onTranslationsWatchEvent(event);
  } else if (isInside(event.file, event.app.config.pagesFolder)) {
    onPagesWatchEvent(event);
  } else if (isInside(event.file, event.app.config.scriptsFolder)) {
    onScriptsWatchEvent(event);
  } else if (isInside(event.file, event.app.config.stylesFolder)) {
    onStylesWatchEvent(event);
  } else {
    event.app.buildPages();
  }
}
