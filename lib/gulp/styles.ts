import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';

import { Options } from '../interfaces/options';

export function compileStyles(options: Options) {
  return gulp.src(path.join(options.src.folder, options.styles.folder, `main.${options.styles.extension}`), {allowEmpty: true})
    .pipe(pug())
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Styles:'}));
}
