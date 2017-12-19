import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as cached from 'gulp-cached';
import * as path from 'path';
import { Config } from '../interfaces/config';
import { toPromise } from '../helpers/to-promise';

export function copyAssets(config: Config) {
  return gulp.src(path.join(config.src.folder, config.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(gulp.dest(config.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

export function promiseCopyAssets(config: Config): Promise<void> {
  return toPromise(copyAssets(config));
}
