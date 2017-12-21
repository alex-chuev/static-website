import * as typescript from 'gulp-typescript';
import ReadWriteStream = NodeJS.ReadWriteStream;
import * as File from 'vinyl';
import { Config } from '../interfaces/config';
import * as path from 'path';
import { toPromise } from '../helpers/to-promise';
import * as gulp from 'gulp';
import { existsSync, readFileSync } from 'fs';
import { Page } from '../entities/page';
import { minify } from 'uglify-js';
import { transpileModule } from 'typescript';
import { Environment } from '../interfaces/environment';

export function onGlobalScriptFileChange(config: Config, event: any): Promise<File> {
  const file = path.join(config.src.folder, config.scripts.folder, `main.${config.scripts.extension}`);
  const base = path.join(config.src.folder, config.scripts.folder);

  return toPromise<File>(compileScriptFile(config, file, base));
}

export function onPageScriptFileChange(config: Config, event: any): Promise<File> {
  const file = event.path;
  const base = path.join(config.src.folder, config.pages.folder);

  return toPromise<File>(compileScriptFile(config, file, base));
}

function compileScriptFile(config: Config, file: string, base: string): ReadWriteStream {
  return gulp.src(file, {base})
    .pipe(typescript())
    .pipe(gulp.dest(config.dist.folder));
}

export function getPageInlineJs(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getJs(config, environment, `${page.id}.inline.${config.scripts.extension}`);
      if (code) {
        map.set(page, code);
      }
      return map;
    }, new WeakMap());
}

export function getPageExternalJs(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getJs(config, environment, `${page.id}.${config.scripts.extension}`);
      if (code) {
        map.set(page, code);
      }
      return map;
    }, new WeakMap());
}

export function getGlobalInlineJs(config: Config, environment: Environment): string {
  return getJs(config, environment, path.join(config.src.folder, config.scripts.folder, `main.inline.${config.scripts.extension}`));
}

export function getGlobalExternalJs(config: Config, environment: Environment): string {
  return getJs(config, environment, path.join(config.src.folder, config.scripts.folder, `main.${config.scripts.extension}`));
}

export function getJs(config: Config, environment: Environment, file: string): string {
  if (existsSync(file)) {
    if (environment.production) {
      return minify(transpileModule(readFileSync(file, 'utf-8'), config.scripts.options).outputText).code;
    } else {
      return transpileModule(readFileSync(file, 'utf-8'), config.scripts.options).outputText;
    }
  }
}
