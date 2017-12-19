import * as path from 'path';
import * as sitemap from 'gulp-sitemap';
import * as debug from 'gulp-debug';
import * as gulp from 'gulp';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;

export function generateSitemap(config: Config): ReadWriteStream {
  return gulp.src(path.join(config.dist.folder, '**/*.html'), {read: false})
    .pipe(sitemap({siteUrl: config.sitemap.domain + config.dist.url}))
    .pipe(gulp.dest(config.dist.folder))
    .pipe(debug({title: 'Sitemap:'}));
}
