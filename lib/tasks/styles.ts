import * as gulp from 'gulp';
import * as gulpStylus from 'gulp-stylus';
import * as stylus from 'stylus';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Config } from '../interfaces/config';
import * as path from "path";
import { toPromise } from '../helpers/to-promise';
import * as File from 'vinyl';
import { existsSync, readFileSync } from 'fs';
import { Page } from '../entities/page';
import { Environment } from '../interfaces/environment';

export function onGlobalStyleFileChange(config: Config, event: any): Promise<File> {
  const file = path.join(config.src.folder, config.styles.folder, `main.${config.styles.extension}`);
  const base = path.join(config.src.folder, config.styles.folder);

  return toPromise<File>(compileStyleFile(config, file, base));
}

export function onPageStyleFileChange(config: Config, event: any): Promise<File> {
  const file = event.path;
  const base = path.join(config.src.folder, config.pages.folder);

  return toPromise<File>(compileStyleFile(config, file, base));
}

function compileStyleFile(config: Config, file: string, base: string): ReadWriteStream {
  return gulp.src(file, {base})
    .pipe(gulpStylus({
      compress: true,
    }))
    .pipe(gulp.dest(config.dist.folder));
}

export function getPageInlineCss(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getCss(config, environment, `${page.id}.inline.${config.styles.extension}`);
      if (code) {
        map.set(page, code);
      }
      return map;
    }, new WeakMap());
}

export function getPageExternalCss(config: Config, environment: Environment, pages: Page[]): WeakMap<Page, string> {
  return pages
    .reduce((map, page) => {
      const code = getCss(config, environment, `${page.id}.${config.styles.extension}`);
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
