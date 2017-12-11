import * as path from 'path';
import * as gulp from 'gulp';
import * as cached from 'gulp-cached';
import * as clean from 'gulp-clean';
import * as sequence from 'gulp-sequence';
import * as debug from 'gulp-debug';
import * as sitemap from 'gulp-sitemap';
import * as pug from 'gulp-pug';
import * as stylus from 'gulp-stylus';
import * as merge from 'gulp-merge';
import { removeSync } from 'fs-extra';

import { loadOptions } from '../lib/cli/utils/load-options';
import { getLanguages } from '../lib/utils/get-languages';

const options = loadOptions();

function assets() {
  return gulp.src(path.join(options.src.folder, options.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

function watchAssets() {
  return gulp.watch(path.join(options.src.folder, options.assets.folder, '**/*'), ['assets'])
    .on('change', function (change) {
      if (change.type === 'deleted') {
        const relative = path.relative(path.join(options.src.folder, options.assets.folder), change.path);
        removeSync(path.join(options.dist.folder, relative));
      }
    });
}

gulp.task('assets', assets);
gulp.task('watch', function() {
  watchAssets();
});

gulp.task('pages', function() {
  const otherLanguages = getLanguages(options);

  return merge(otherLanguages.map(language => {
    return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
      .pipe(pug({data: {language, otherLanguages, i18n: () => {}}}))
      .pipe(gulp.dest(options.dist.folder))
      .pipe(debug({title: 'Pages:'}));
  }))
});

gulp.task('clean', function () {
  return gulp.src(options.dist.folder, {read: false})
    .pipe(clean());
});

gulp.task('sitemap', function () {
  return gulp.src(path.join(options.dist.folder, '**/*.html'), {read: false})
    .pipe(sitemap({
      siteUrl: options.dist.url,
    }))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Sitemap:'}));
});

gulp.task('build', sequence('clean', 'assets', 'pages', 'sitemap'));
gulp.task('default', sequence('build', 'watch'));
