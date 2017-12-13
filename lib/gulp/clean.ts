import * as gulp from 'gulp';
import * as clean from 'gulp-clean';

import { Options } from '../interfaces/options';

export function cleanDist(options: Options) {
  return gulp.src(options.dist.folder, {
    read: false,
    allowEmpty: true,
  })
    .pipe(clean());
}
