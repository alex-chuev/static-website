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
import * as stream from 'stream';

const s = new stream.Readable({
  objectMode: true,
});

import { Page, PageData } from '../entities/page';
import { Language } from '../entities/language';
import { Environment } from '../interfaces/environment';
import { Options } from '../interfaces/options';
import ReadWriteStream = NodeJS.ReadWriteStream;
import WritableStream = NodeJS.WritableStream;

const environment: Environment = {
  production: false,
};

function fetchLanguages(options: Options): Promise<Language[]> {
  return new Promise(resolve => {
    const languages: Language[] = [];

    gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
      .on('data', file => languages.push(new Language(file, options)))
      .on('end', () => resolve(languages))
  });
}

function createPages(options: Options): ReadWriteStream {
  const promise = fetchLanguages(options);

  return through2(function (file: File, enc: string, callback) {
    promise.then(languages => {
      languages.forEach(language => {
        const page = file.clone();
        page.data = new PageData(page, language, languages, options);
        this.push(page);
      });

      callback();
    });
  });
}

function fetchStyle(glob: string, target: File[]): Promise<File> {
  return fetchCode(glob, stylus(), target);
}

function fetchScript(glob: string, target: File[]): Promise<File> {
  return fetchCode(glob, typescript(), target);
}

function fetchCode(glob: string, writableStream: WritableStream, target: File[]): Promise<File> {
  return new Promise(resolve => {
    gulp.src(glob, {allowEmpty: true})
      .pipe(writableStream)
      .on('data', file => target.push(file))
      .on('end', () => resolve());
  });
}

function fetchPageCode(options: Options): ReadWriteStream {
  const externalStylesPath = path.join(options.src.folder, options.styles.folder, `main.${options.styles.extension}`);
  const inlineStylesPath = path.join(options.src.folder, options.styles.folder, `main.inline.${options.styles.extension}`);
  const externalScriptsPath = path.join(options.src.folder, options.scripts.folder, `main.${options.scripts.extension}`);
  const inlineScriptsPath = path.join(options.src.folder, options.scripts.folder, `main.inline.${options.scripts.extension}`);

  return through2(function (page: Page, enc: string, callback) {
    Promise.all([
      fetchStyle(externalStylesPath, page.data.css.external),
      fetchStyle(inlineStylesPath, page.data.css.inline),
      fetchScript(externalScriptsPath, page.data.js.external),
      fetchScript(inlineScriptsPath, page.data.js.inline),
      fetchStyle(page.data.externalStylesPath, page.data.css.external),
      fetchStyle(page.data.inlineStylesPath, page.data.css.inline),
      fetchScript(page.data.externalScriptsPath, page.data.js.external),
      fetchScript(page.data.inlineScriptsPath, page.data.js.inline),
    ]).then(() => callback(null, page));
  });
}

function addPageLanguagePath(options: Options): ReadWriteStream {
  const pagesSrc = path.join(options.src.folder, options.pages.folder);

  return through2(function (page: Page, enc: string, callback) {
    page.path = path.resolve(path.join(pagesSrc, page.data.language.url, path.relative(pagesSrc, page.path)));
    callback(null, page);
  });
}

function exposeAssets(options: Options): ReadWriteStream {
  return through2(function (page: Page, enc: string, callback) {
    page.data.css.external.forEach(file => this.push(file));
    page.data.js.external.forEach(file => this.push(file));

    callback();
  });
}

export function compilePages(options: Options) {
  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(createPages(options))
    .pipe(fetchPageCode(options))
    .pipe(pug())
    .pipe(addPageLanguagePath(options))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Pages:'}))
    .pipe(exposeAssets(options))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Page assets:'}));
}
