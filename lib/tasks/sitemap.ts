import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as sitemap from 'gulp-sitemap';
import * as debug from 'gulp-debug';

import { Config } from '../interfaces/config';
import * as stream from 'stream';
import { PageFile } from '../entities/page';

export function generateSitemap(options: Config) {
  return vfs.src(path.join(options.dist.folder, '**/*.html'), {read: false})
    .pipe(sitemap({
      siteUrl: options.sitemap.domain + options.dist.url,
    }))
    .pipe(vfs.dest(options.dist.folder))
    .pipe(debug({title: 'Sitemap:'}));
}

export function promiseGenerateSitemap(config: Config, pages: PageFile[]) {
  const str = new stream.PassThrough();
}
