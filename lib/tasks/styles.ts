import { Config } from '../interfaces/config';
import * as path from 'path';
import { existsSync } from 'fs';
import { Page } from '../entities/page';
import { Environment } from '../interfaces/environment';
import { CssCode } from './code';

export function getPageCss(config: Config, environment: Environment, pages: Page[], inline = false): WeakMap<Page, CssCode> {
  const basePath = path.join(config.src.folder, config.pages.folder);

  return pages
    .reduce((map, page) => {
      const relativePath = `${page.relativePathWithoutExt}${inline ? '.inline' : ''}.${config.styles.extension}`;
      const code = getCss(basePath, relativePath, config, environment);

      return code ? map.set(page, code) : map;
    }, new WeakMap());
}

export function getGlobalCss(config: Config, environment: Environment, inline = false): CssCode {
  const basePath = path.join(config.src.folder, config.styles.folder);
  const relativePath = `main${inline ? '.inline' : ''}.${config.styles.extension}`;

  return getCss(basePath, relativePath, config, environment);
}

export function getCss(basePath: string, relativePath: string, config: Config, environment: Environment): CssCode {
  if (existsSync(path.join(basePath, relativePath))) {
    return new CssCode(basePath, relativePath, config, environment);
  }
}
