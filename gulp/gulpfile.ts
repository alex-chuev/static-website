import * as path from 'path';
import * as gulp from 'gulp';
import * as cached from 'gulp-cached';
import * as clean from 'gulp-clean';
import * as sequence from 'gulp-sequence';
import * as debug from 'gulp-debug';
import * as sitemap from 'gulp-sitemap';
import * as pug from 'gulp-pug';
import * as stylus from 'gulp-stylus';
import * as data from 'gulp-data';
import * as through from 'through2';
import { removeSync } from 'fs-extra';
import * as File from 'vinyl';

import { loadOptions } from '../lib/cli/utils/load-options';
import { getLanguages } from '../lib/utils/get-languages';
import { TemplateHelpersFactory } from '../lib/factories/template-helpers-factory';
import { Language } from '../lib/entities/language';
import { Environment } from '../lib/interfaces/environment';
import { PageId } from '../lib/types';
import { removePageExtension } from '../lib/utils/get-pages';

const options = loadOptions();

function assets() {
  return gulp.src(path.join(options.src.folder, options.assets.folder, '**/*'))
    .pipe(cached('assets'))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Assets:'}));
}

function watchAssets() {
  return gulp.watch(path.join(options.src.folder, options.assets.folder, '**/*'), ['assets'])
    .on('change', function (change: any) {
      if (change.type === 'deleted') {
        const relative = path.relative(path.join(options.src.folder, options.assets.folder), change.path);
        removeSync(path.join(options.dist.folder, relative));
      }
    });
}

gulp.task('assets', assets);
gulp.task('watch', function () {
  watchAssets();
});

interface Page extends File {
  id: PageId;
  language: Language;
}

gulp.task('pages', function () {
  const languages = getLanguages(options);

  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(through.obj(function (file: File, enc, callback) {
      languages.forEach(language => {
        const page: File = file.clone();
        page.language = language;
        page.id = removePageExtension(file.relative, options);
        this.push(page);
      });

      callback();
    }))
    .pipe(data(function (page: Page, cb) {
      const language: Language = page.language;
      const environment: Environment = {
        production: false,
      };
      const otherLanguages = languages.filter(item => item !== language);
      const codes = {css: {external: [], inline: []}, js: {external: [], inline: []}};
      const helpers = TemplateHelpersFactory.createTemplateHelpers(page.id, page.language, options);

      gulp.src(path.join(page.base, `${page.id}.${options.styles.extension}`))
        .pipe(stylus())
        .pipe(gulp.dest(options.dist.folder));

      gulp.src(path.join(page.base, `${page.id}.inline.${options.styles.extension}`))
        .pipe(stylus())
        .pipe(gulp.dest(options.dist.folder))
        .pipe(through.obj(function (file: File, enc, callback) {
          console.log(file);
          callback(null, file);
        }));

      gulp.src(path.join(page.base, `${page.id}.${options.styles.extension}`))
        .pipe(stylus())
        .pipe(gulp.dest(options.dist.folder))
        .pipe(through.obj(function (file: File, enc, callback) {
          console.log(file);
          callback(null, file);
        }));

      cb(null, {
        language,
        environment,
        otherLanguages,
        ...codes,
        ...helpers,
      });
    }))
    .pipe(pug())
    .pipe(through.obj(function (file: File, enc, callback) {
      file.path = path.join(file.base, file.language.url, file.relative);
      callback(null, file);
    }))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Pages:'}));
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
