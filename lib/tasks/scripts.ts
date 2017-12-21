import { Config } from '../interfaces/config';
import * as path from 'path';
import { existsSync } from 'fs';
import { Page } from '../entities/page';
import { Environment } from '../interfaces/environment';
import { JsCode } from './code';

export function getPageJs(config: Config, environment: Environment, pages: Page[], inline = false): WeakMap<Page, JsCode> {
  const basePath = path.join(config.src.folder, config.pages.folder);

  return pages
    .reduce((map, page) => {
      const relativePath = `${page.relativePathWithoutExt}${inline ? '.inline' : ''}.${config.scripts.extension}`;
      const code = getJs(basePath, relativePath, config, environment);

      return code ? map.set(page, code) : map;
    }, new WeakMap());
}

export function getGlobalJs(config: Config, environment: Environment, inline = false): JsCode {
  const basePath = path.join(config.src.folder, config.scripts.folder);
  const relativePath = `main${inline ? '.inline' : ''}.${config.scripts.extension}`;

  return getJs(basePath, relativePath, config, environment);
}

export function getJs(basePath: string, relativePath: string, config: Config, environment: Environment): JsCode {
  if (existsSync(path.join(basePath, relativePath))) {
    return new JsCode(basePath, relativePath, config, environment);
  }
}
