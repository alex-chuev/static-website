import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as typescript from 'gulp-typescript';

import { Options } from '../interfaces/options';

export function compileScripts(options: Options) {
  return gulp.src(path.join(options.src.folder, options.scripts.folder, `main.${options.scripts.extension}`), {allowEmpty: true})
    .pipe(typescript())
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Scripts:'}));
}
