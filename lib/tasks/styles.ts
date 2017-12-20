import * as gulp from 'gulp';
import * as stylus from 'gulp-stylus';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { compileCode } from './code';
import { Config } from '../interfaces/config';
import * as path from "path";
import { toPromise } from '../helpers/to-promise';
import * as File from 'vinyl';

export function compileStyle(glob: string): ReadWriteStream {
  return compileCode(glob, stylus({
    compress: true
  }));
}

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
    .pipe(stylus({
      compress: true,
    }))
    .pipe(gulp.dest(config.dist.folder));
}
