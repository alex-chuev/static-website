import { App } from '../entities/app';
import { AppStylesCodeListener } from '../listerers/app-styles-code-listener';
import { PagesListener } from '../listerers/pages-listener';
import { AppScriptsCodeListener } from '../listerers/app-scripts-code-listener';
import { Listener } from '../listerers/listener';
import { TranslationsListener } from '../listerers/translations-listener';
import { AssetsListener } from '../listerers/assets-listener';
import { PagesStylesListener } from '../listerers/pages-styles-listener';
import { PagesScriptsListener } from '../listerers/pages-scripts-listener';
import { WatchAction } from '../enums/watch-action';
import * as chokidar from 'chokidar';
import * as path from 'path';
import { FSWatcher } from 'chokidar';
import { LayoutsListener } from '../listerers/layouts-listener';

export function watch(app: App): FSWatcher {
  const listeners: Listener[] = [
    new AssetsListener(app),
    new TranslationsListener(app),
    new PagesListener(app),
    new PagesStylesListener(app),
    new PagesScriptsListener(app),
    new AppStylesCodeListener(app),
    new AppScriptsCodeListener(app),
    new LayoutsListener(app),
  ];

  return chokidar.watch(path.join(app.config.src.folder, '**/*'), {ignoreInitial: true})
    .on(WatchAction.Add, file => onWatchEvent(path.resolve(file), WatchAction.Add))
    .on(WatchAction.Change, file => onWatchEvent(path.resolve(file), WatchAction.Change))
    .on(WatchAction.Unlink, file => onWatchEvent(path.resolve(file), WatchAction.Unlink));

  function onWatchEvent(absolutePath: string, action: WatchAction) {
    if (shouldIgnoreEvent(absolutePath)) {
      return;
    }

    listeners
      .filter(listener => listener.test(absolutePath))
      .map(listener => listener[action].call(listener, absolutePath));
  }
}

function shouldIgnoreEvent(absolutePath: string): boolean {
  return absolutePath.indexOf('___jb_tmp___') !== -1;
}
