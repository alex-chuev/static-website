import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as stylus from 'gulp-stylus';

import { Options } from '../interfaces/options';

export function compileStyles(options: Options) {
  return gulp.src(path.join(options.src.folder, options.styles.folder, `main.${options.styles.extension}`), {allowEmpty: true})
    .pipe(stylus())
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Styles:'}));
}
