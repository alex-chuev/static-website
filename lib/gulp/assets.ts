import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as cached from 'gulp-cached';
import * as path from 'path';
import { removeSync } from 'fs-extra';

import { Options } from '../interfaces/options';

export function assets(options: Options) {
  return gulp.src(path.join(options.src.folder, options.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

export function watchAssets(options: Options) {
  return gulp.watch(path.join(options.src.folder, options.assets.folder, '**/*'), assets.bind(null, options))
    .on('change', function (change: any) {
      if (change.type === 'deleted') {
        const relative = path.relative(path.join(options.src.folder, options.assets.folder), change.path);
        removeSync(path.join(options.dist.folder, relative));
      }
    });
}
