import * as chokidar from 'chokidar';
import { create } from 'browser-sync';
import * as path from 'path';
import { isInside } from 'is-inside';
import { WatchAction } from '../../enums/watch-action';
import { WatchEvent } from '../../interfaces/watch-event';
import { App } from '../../entities/app';
import { AppConfig } from '../../entities/app-config';
import { Page } from '../../entities/page';

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

  function onWatchEvent(event: WatchEvent) {
    if (isInside(event.file, app.config.assetsFolder)) {
      onAssetsWatchEvent(event);
    } else if (isInside(event.file, app.config.translationsFolder)) {
      onTranslationsWatchEvent(event);
    } else if (isInside(event.file, app.config.pagesFolder)) {
      onPagesWatchEvent(event);
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
    if (false === config.isTranslationFile(event.file)) {
      return;
    }

    switch (event.action) {
      case WatchAction.Add:
        const addedLanguage = app.languages.addLanguage(event.file);
        app.pages.build(app.pages.items, [addedLanguage]);
        break;
      case WatchAction.Change:
        const updatedLanguage = app.languages.updateLanguage(event.file);
        app.pages.build(app.pages.items, [updatedLanguage]);
        break;
      case WatchAction.Unlink:
        const removedLanguages = app.languages.removeLanguages(event.file);
        app.pages.undistPages(app.pages.items, removedLanguages);
        break;
    }
  }

  function onPagesWatchEvent(event: WatchEvent) {
    if (false === config.isPageFile(event.file)) {
      switch (event.action) {
        case WatchAction.Add:
          const addedPages = [
            app.pages.addPage(event.file),
          ];
          app.pages.build(addedPages);
          app.pages.distCode(addedPages);
          break;
        case WatchAction.Change:
          app.pages.build([
            app.pages.getPage(event.file),
          ]);
          break;
        case WatchAction.Unlink:
          app.pages.undistPages(app.pages.removePages(event.file));
          break;
      }
    } else if (false === config.isStyleFile(event.file)) {
      const pageId = Page.createPageId(event.file, config);
      const page = app.pages.getPageById(pageId);

      if (undefined === page) {
        return;
      }

      switch (event.action) {
        case WatchAction.Add:
          const addedCode = page.css.addCode(event.file);
          addedCode.dist();
          app.pages.build([page]);
          break;
        case WatchAction.Change:
          const updatedCode = page.css.getCode(event.file);
          updatedCode.updateContent();
          updatedCode.dist();
          break;
        case WatchAction.Unlink:
          const removedCode = page.css.removeCode(event.file);
          removedCode.forEach(code => code.undist());
          app.pages.build([page]);
          break;
      }
    } else if (false === config.isScriptFile(event.file)) {
      const pageId = Page.createPageId(event.file, config);
      const page = app.pages.getPageById(pageId);

      if (undefined === page) {
        return;
      }

      switch (event.action) {
        case WatchAction.Add:
          const addedCode = page.js.addCode(event.file);
          addedCode.dist();
          app.pages.build([page]);
          break;
        case WatchAction.Change:
          const updatedCode = page.js.getCode(event.file);
          updatedCode.updateContent();
          updatedCode.dist();
          break;
        case WatchAction.Unlink:
          const removedCode = page.js.removeCode(event.file);
          removedCode.forEach(code => code.undist());
          app.pages.build([page]);
          break;
      }
    }
  }
}
