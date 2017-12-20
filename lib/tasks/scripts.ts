import * as typescript from 'gulp-typescript';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { compileCode } from './code';
import * as File from 'vinyl';
import { Config } from '../interfaces/config';
import * as path from "path";
import { toPromise } from '../helpers/to-promise';
import * as gulp from 'gulp';

export function compileScript(glob: string): ReadWriteStream {
  return compileCode(glob, typescript());
}

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
