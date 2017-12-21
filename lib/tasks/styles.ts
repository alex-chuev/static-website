import * as stylus from 'stylus';
import { Config } from '../interfaces/config';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { Page } from '../entities/page';
import { Environment } from '../interfaces/environment';

export function getPageInlineCss(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getCss(config, environment, `${page.fullPathWithoutExt}.inline.${config.styles.extension}`);
      if (code) {
        map.set(page, code);
      }
      return map;
    }, new WeakMap());
}

export function getPageExternalCss(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getCss(config, environment, `${page.fullPathWithoutExt}.${config.styles.extension}`);
      if (code) {
        map.set(page, code);
      }
      return map;
    }, new WeakMap());
}

export function getGlobalInlineCss(config: Config, environment: Environment): string {
  return getCss(config, environment, path.join(config.src.folder, config.styles.folder, `main.inline.${config.styles.extension}`));
}

export function getGlobalExternalCss(config: Config, environment: Environment): string {
  return getCss(config, environment, path.join(config.src.folder, config.styles.folder, `main.${config.styles.extension}`));
}

export function getCss(config: Config, environment: Environment, filename: string): string {
  if (existsSync(filename)) {
    let code: string;

    stylus(readFileSync(filename, 'utf-8'))
      .set('filename', filename)
      .set('compress', environment.production)
      .render(function (error, css) {
        code = css;
      });

    return code;
  }
}
