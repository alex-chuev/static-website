import { App } from '../entities/app/app';
import { PagesListener } from '../listerers/pages-listener';
import { AppCodeListener } from '../listerers/app-code-listener';
import { Listener } from '../listerers/listener';
import { TranslationsListener } from '../listerers/translations-listener';
import { AssetsListener } from '../listerers/assets-listener';
import { PagesCodeListener } from '../listerers/pages-code-listener';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as glob from 'glob';
import { FSWatcher } from 'chokidar';
import { LayoutsListener } from '../listerers/layouts-listener';
import { FileObject } from '../entities/file-object';
import { TypescriptListener } from '../listerers/typescript-listener';

enum WatchAction {
  Add = 'add',
  Change = 'change',
  Unlink = 'unlink',
}

export function watch(app: App): FSWatcher {
  const typescriptListener = new TypescriptListener(app);

  const listeners: Listener[] = [
    new AssetsListener(app),
    new TranslationsListener(app),
    new PagesListener(app),
    new PagesCodeListener(app),
    new AppCodeListener(app),
    new LayoutsListener(app),
    typescriptListener,
  ];

  glob.sync(path.join(app.config.src.folder, '**/*.ts'))
    .forEach(file => typescriptListener.add(new FileObject(file)));

  return chokidar.watch(path.join(app.config.src.folder, '**/*'), {ignoreInitial: true})
    .on(WatchAction.Add, file => onWatchEvent(new FileObject(file), WatchAction.Add))
    .on(WatchAction.Change, file => onWatchEvent(new FileObject(file), WatchAction.Change))
    .on(WatchAction.Unlink, file => onWatchEvent(new FileObject(file), WatchAction.Unlink));

  function onWatchEvent(file: FileObject, action: WatchAction) {
    if (shouldIgnoreEvent(file)) {
      return;
    }

    listeners
      .filter(listener => listener.test(file))
      .map(listener => listener[action].call(listener, file));
  }
}

function shouldIgnoreEvent(file: FileObject): boolean {
  return file.absolutePath.indexOf('___jb_tmp___') !== -1;
}
