import * as path from 'path';
import * as gulp from 'gulp';
import * as sitemap from 'gulp-sitemap';
import * as debug from 'gulp-debug';

import { Config } from '../interfaces/config';

export function generateSitemap(options: Config) {
  return gulp.src(path.join(options.dist.folder, '**/*.html'), {read: false})
    .pipe(sitemap({
      siteUrl: options.sitemap.domain + options.dist.url,
    }))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Sitemap:'}));
}
