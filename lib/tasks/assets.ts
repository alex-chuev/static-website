import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as cached from 'gulp-cached';
import * as path from 'path';
import { obj as through2 } from 'through2';

import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Page } from '../entities/page';

export function copyAssets(options: Config) {
  return gulp.src(path.join(options.src.folder, options.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

export function exposePageAssets(options: Config): ReadWriteStream {
  return through2(function (page: Page, enc: string, callback) {
    page.data.assets.forEach(file => this.push(file));

    callback();
  });
}
