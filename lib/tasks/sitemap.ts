import * as path from 'path';
import * as sitemap from 'gulp-sitemap';
import * as debug from 'gulp-debug';
import * as gulp from 'gulp';
import { Config } from '../interfaces/config';
import toArray = require('stream-to-array');

function generateSitemap(config: Config) {
  return gulp.src(path.join(config.dist.folder, '**/*.html'), {read: false})
    .pipe(sitemap({siteUrl: config.sitemap.domain + config.dist.url}))
    .pipe(gulp.dest(config.dist.folder))
    .pipe(debug({title: 'Sitemap:'}));
}

export function promiseGenerateSitemap(config: Config): Promise<File[]> {
  return toArray(generateSitemap(config));
}
