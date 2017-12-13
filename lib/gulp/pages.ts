import * as path from 'path';
import * as stylus from 'gulp-stylus';
import * as gulp from 'gulp';
import * as data from 'gulp-data';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import * as typescript from 'gulp-typescript';
import { obj as combine } from 'stream-combiner2';
import { obj as through2 } from 'through2';
import * as File from 'vinyl';
import * as merge2 from 'merge2';

import { Page, PageData } from '../entities/page';
import { Language } from '../entities/language';
import { Environment } from '../interfaces/environment';
import { Options } from '../interfaces/options';
import ReadWriteStream = NodeJS.ReadWriteStream;

const environment: Environment = {
  production: false,
};

function fetchPages(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(through2(function (file: File, enc: string, callback) {
      file.data = new PageData(file, options);
      callback(null, file);
    }));
}

function fetchLanguages(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(through2(function (file: File, enc: string, callback) {
      callback(null, new Language(file, options));
    }));
}

function fetchStyles(globs: string | string[]): ReadWriteStream {
  return gulp.src(globs, {
    allowEmpty: true,
  }).pipe(stylus());
}

function fetchScripts(globs: string | string[]): ReadWriteStream {
  return gulp.src(globs, {
    allowEmpty: true,
  }).pipe(typescript());
}

// function fetchCode(options: Options): ReadWriteStream {
// }
//
// function flattenLanguages(options: Options): ReadWriteStream {
//   return through2(function (page: Page, enc: string, callback) {
//     page.languages.forEach(language => {
//       page.language = language;
//
//       this.push(page);
//     });
//
//     callback();
//   });
// }
//
// function exposeExternalCode(options: Options): ReadWriteStream {
// }
//
// export function compilePages(options: Options) {
//   fetchPages(options)
//     .pipe(fetchLanguages(options))
//     .pipe(fetchCode(options))
//     .pipe(flattenLanguages(options))
//     .pipe(data({}))
//     .pipe(pug())
//     .pipe(gulp.dest(options.dist.folder))
//     .pipe(exposeExternalCode(options))
//     .pipe(gulp.dest(options.dist.folder))
//   ;
// }

export function compilePages(options: Options) {
  return merge2(
    [
      fetchStyles(path.join(options.src.folder, options.styles.folder, `main.${options.styles.extension}`)),
      fetchStyles(path.join(options.src.folder, options.styles.folder, `main.inline.${options.styles.extension}`)),
      fetchScripts(path.join(options.src.folder, options.scripts.folder, `main.${options.scripts.extension}`)),
      fetchScripts(path.join(options.src.folder, options.scripts.folder, `main.inline.${options.scripts.extension}`)),
      fetchLanguages(options),
    ],
    fetchPages(options)
      .pipe(through2(function (page: Page, enc, callback) {
        merge2([
          fetchStyles(page.externalStylesPath),
          fetchStyles(page.inlineStylesPath),
          fetchScripts(page.externalScriptsPath),
          fetchScripts(page.inlineScriptsPath),
        ]);

        this.push(page.file);

        callback();
      }))
      .pipe(data(function (page: Page, cb) {
        cb(null, {/* create page data */});
      }))
      .pipe(pug())
      .pipe(gulp.dest(options.dist.folder))
      .pipe(debug({title: 'Pages:'}))
  );
}
