import * as path from 'path';
import { Page } from '../entities/page';
import { Config } from '../interfaces/config';
import * as glob from 'glob';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';

export function getPages(config: Config): Page[] {
  return glob.sync(path.join(config.src.folder, config.pages.folder, `**/*.${config.pages.extension}`))
    .map(file => new Page(file, config));
}

export function onPagesWatchEvent(event: WatchEvent) {
  switch (event.action) {
    case WatchAction.Add:
    case WatchAction.Change:
    case WatchAction.Unlink:
      break;
  }
}
