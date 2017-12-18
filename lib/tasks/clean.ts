import * as gulp from 'gulp';
import * as clean from 'gulp-clean';

import { Config } from '../interfaces/config';

export function cleanDist(options: Config) {
  return gulp.src(options.dist.folder, {
    read: false,
    allowEmpty: true,
  })
    .pipe(clean());
}
