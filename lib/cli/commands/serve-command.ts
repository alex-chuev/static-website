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
    .on(WatchAction.Add, file => onWatchEvent({absolutePath: path.resolve(file), action: WatchAction.Add}))
    .on(WatchAction.Change, file => onWatchEvent({absolutePath: path.resolve(file), action: WatchAction.Change}))
    .on(WatchAction.Unlink, file => onWatchEvent({absolutePath: path.resolve(file), action: WatchAction.Unlink}));

  function onWatchEvent(event: WatchEvent) {
    if (isInside(event.absolutePath, app.config.assetsFolder)) {
      onAssetsWatchEvent(event);
    } else if (isInside(event.absolutePath, app.config.translationsFolder)) {
      onTranslationsWatchEvent(event);
    } else if (isInside(event.absolutePath, app.config.pagesFolder)) {
      onPagesWatchEvent(event);
    } else if (isInside(event.absolutePath, app.config.scriptsFolder)) {
      onScriptsWatchEvent(event);
    } else if (isInside(event.absolutePath, app.config.stylesFolder)) {
      onStylesWatchEvent(event);
    } else {
      app.pages.build();
    }
  }

  function onStylesWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
        const addedCode = app.css.addCode(event.absolutePath);
        addedCode.dist();
        app.pages.build();
        break;
      case WatchAction.Change:
        const updatedCode = app.css.getCode(event.absolutePath);
        updatedCode.updateContent();
        updatedCode.dist();
        break;
      case WatchAction.Unlink:
        const removedCode = app.css.removeCode(event.absolutePath);
        removedCode.forEach(code => code.undist());
        app.pages.build();
        break;
    }
  }

  function onScriptsWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
        const addedCode = app.js.addCode(event.absolutePath);
        addedCode.dist();
        app.pages.build();
        break;
      case WatchAction.Change:
        const updatedCode = app.js.getCode(event.absolutePath);
        updatedCode.updateContent();
        updatedCode.dist();
        break;
      case WatchAction.Unlink:
        const removedCode = app.js.removeCode(event.absolutePath);
        removedCode.forEach(code => code.undist());
        app.pages.build();
        break;
    }
  }

  function onAssetsWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
        app.assets.distFile(event.absolutePath);
        break;
      case WatchAction.Unlink:
        app.assets.unlinkAsset(event.absolutePath);
        break;
    }
  }


  function onTranslationsWatchEvent(event: WatchEvent) {
    if (false === config.isTranslationFile(event.absolutePath)) {
      return;
    }

    switch (event.action) {
      case WatchAction.Add:
        const addedLanguage = app.languages.addLanguage(event.absolutePath);
        app.pages.build(app.pages.items, [addedLanguage]);
        break;
      case WatchAction.Change:
        const updatedLanguage = app.languages.updateLanguage(event.absolutePath);
        app.pages.build(app.pages.items, [updatedLanguage]);
        break;
      case WatchAction.Unlink:
        const removedLanguages = app.languages.removeLanguages(event.absolutePath);
        app.pages.undistPages(app.pages.items, removedLanguages);
        break;
    }
  }

  function onPagesWatchEvent(event: WatchEvent) {
    if (false === config.isPageFile(event.absolutePath)) {
      switch (event.action) {
        case WatchAction.Add:
          const addedPages = [
            app.pages.addPage(event.absolutePath),
          ];
          app.pages.build(addedPages);
          app.pages.distCode(addedPages);
          break;
        case WatchAction.Change:
          app.pages.build([
            app.pages.getPage(event.absolutePath),
          ]);
          break;
        case WatchAction.Unlink:
          app.pages.undistPages(app.pages.removePages(event.absolutePath));
          break;
      }
    } else if (false === config.isStyleFile(event.absolutePath)) {
      const pageId = Page.createPageId(event.absolutePath);
      const page = app.pages.getPageById(pageId);

      if (undefined === page) {
        return;
      }

      switch (event.action) {
        case WatchAction.Add:
          const addedCode = page.css.addCode(event.absolutePath);
          addedCode.dist();
          app.pages.build([page]);
          break;
        case WatchAction.Change:
          const updatedCode = page.css.getCode(event.absolutePath);
          updatedCode.updateContent();
          updatedCode.dist();
          break;
        case WatchAction.Unlink:
          const removedCode = page.css.removeCode(event.absolutePath);
          removedCode.forEach(code => code.undist());
          app.pages.build([page]);
          break;
      }
    } else if (false === config.isScriptFile(event.absolutePath)) {
      const pageId = Page.createPageId(event.absolutePath);
      const page = app.pages.getPageById(pageId);

      if (undefined === page) {
        return;
      }

      switch (event.action) {
        case WatchAction.Add:
          const addedCode = page.js.addCode(event.absolutePath);
          addedCode.dist();
          app.pages.build([page]);
          break;
        case WatchAction.Change:
          const updatedCode = page.js.getCode(event.absolutePath);
          updatedCode.updateContent();
          updatedCode.dist();
          break;
        case WatchAction.Unlink:
          const removedCode = page.js.removeCode(event.absolutePath);
          removedCode.forEach(code => code.undist());
          app.pages.build([page]);
          break;
      }
    }
  }
}
