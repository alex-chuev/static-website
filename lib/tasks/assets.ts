import * as vfs from 'vinyl-fs';
import * as debug from 'gulp-debug';
import * as cached from 'gulp-cached';
import * as path from 'path';
import { obj as through2 } from 'through2';

import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { PageFile } from '../entities/page';

export function copyAssets(options: Config) {
  return vfs.src(path.join(options.src.folder, options.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(vfs.dest(options.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

export function exposePageAssets(options: Config): ReadWriteStream {
  return through2(function (page: PageFile, enc: string, callback) {
    page.data.assets.forEach(file => this.push(file));

    callback();
  });
}
