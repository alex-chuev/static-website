import { Config } from '../entities/config';
import * as path from 'path';
import { existsSync } from 'fs';
import { Page } from '../entities/page';
import { Environment } from '../interfaces/environment';
import { CssCode } from './code';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';

export function getPageCss(config: Config, environment: Environment, pages: Page[], inline = false): WeakMap<Page, CssCode> {
  const pagesFolder = config.pagesFolder;

  return pages
    .reduce((map, page) => {
      const relativePath = `${page.relativePathWithoutExt}${inline ? '.inline' : ''}.${config.styles.extension}`;
      const code = getCss(pagesFolder, relativePath, config, environment);

      return code ? map.set(page, code) : map;
    }, new WeakMap());
}

export function getGlobalCss(config: Config, environment: Environment, inline = false): CssCode {
  const relativePath = `main${inline ? '.inline' : ''}.${config.styles.extension}`;

  return getCss(config.stylesFolder, relativePath, config, environment);
}

export function getCss(basePath: string, relativePath: string, config: Config, environment: Environment): CssCode {
  if (existsSync(path.join(basePath, relativePath))) {
    return new CssCode(basePath, relativePath, config, environment);
  }
}

export function onStylesWatchEvent(event: WatchEvent) {
  switch (event.action) {
    case WatchAction.Add:
    case WatchAction.Change:
    case WatchAction.Unlink:
      break;
  }
}
