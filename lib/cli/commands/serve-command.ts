import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import { isInside } from 'is-inside';
import { WatchAction } from '../../enums/watch-action';
import { WatchEvent } from '../../interfaces/watch-event';
import { App } from '../../entities/app';
import { AppConfig } from '../../entities/app-config';

export function serveCommand() {
  const config = new AppConfig();
  const environment = {
    production: false,
  };
  const app = new App(config, environment);
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

  chokidar.watch(path.join(app.config.src.folder, '**/*'), {
    ignoreInitial: true,
  })
    .on(WatchAction.Add, file => onWatchEvent({file, action: WatchAction.Add}))
    .on(WatchAction.Change, file => onWatchEvent({file, action: WatchAction.Change}))
    .on(WatchAction.Unlink, file => onWatchEvent({file, action: WatchAction.Unlink}));

  // chokidar.watch(path.join(app.config.src.folder, app.config.scripts.folder, `**/*.${app.config.scripts.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.js = getGlobalJs(app.config, app.environment, true);
  //     app.externalJs = getGlobalJs(app.config, app.environment);
  //     saveExternalJs(app);
  //   });
  //
  // chokidar.watch(path.join(app.config.src.folder, app.config.styles.folder, `**/*.${app.config.styles.extension}`), {ignoreInitial: true})
  //   .on('change', file => {
  //     app.css = getCss(app.config, app.environment, true);
  //     app.externalCss = getCss(app.config, app.environment);
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

  function onWatchEvent(event: WatchEvent) {
    if (isInside(event.file, app.config.assetsFolder)) {
      onAssetsWatchEvent(event);
    } else if (isInside(event.file, app.config.translationsFolder)) {
      onTranslationsWatchEvent(event);
    } else if (isInside(event.file, app.config.pagesFolder)) {
      app.pages.onWatchEvent(event);
    } else if (isInside(event.file, app.config.scriptsFolder)) {
      app.js.onWatchEvent(event);
    } else if (isInside(event.file, app.config.stylesFolder)) {
      app.css.onWatchEvent(event);
    } else {
      app.pages.build();
    }
  }

  function onAssetsWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
        app.assets.distFile(event.file);
        break;
      case WatchAction.Unlink:
        app.assets.unlinkAsset(event.file);
        break;
    }
  }


  function onTranslationsWatchEvent(event: WatchEvent) {
    if (path.extname(event.file) !== `.${config.translations.extension}`) {
      return;
    }

    switch (event.action) {
      case WatchAction.Add:
        app.pages.build(app.pages.items, [
          app.languages.addLanguage(event.file),
        ]);
        break;
      case WatchAction.Change:
        app.pages.build(app.pages.items, [
          app.languages.updateLanguage(event.file),
        ]);
        break;
      case WatchAction.Unlink:
        app.pages.unlinkDistPages(app.pages.items, app.languages.removeLanguages(event.file));
        break;
    }
  }
}
