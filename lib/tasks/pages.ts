import * as path from 'path';
import * as stylus from 'gulp-stylus';
import * as gulp from 'gulp';
import * as data from 'gulp-data';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import * as typescript from 'gulp-typescript';
import { obj as through2 } from 'through2';
import { File, replaceExtension } from 'gulp-util';
import { Page, PageData, PageDataProps, PageDependencies } from '../entities/page';
import { Language } from '../entities/language';
import { Options } from '../interfaces/options';
import ReadWriteStream = NodeJS.ReadWriteStream;
import toArray = require('stream-to-array');
import { PageCode } from '../entities/page-code';

function fetchPageFiles(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(debug({title: 'Found pages:', showFiles: false}));
}

function fetchLanguages(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(debug({title: 'Found languages:', showFiles: false}))
    .pipe(through2(function (file: File, enc: string, callback) {
      callback(null, new Language(file, options));
    }));
}

function createPage(props: PageDataProps): Page {
  const page = props.file.clone();
  page.data = new PageData(props);
  return page as Page;
}

function fetchCode(stylesPath: string, scriptsPath: string, options: Options): Promise<PageCode> {
  return Promise.all([
    toArray(compileStyle(path.join(stylesPath, `.${options.styles.extension}`))),
    toArray(compileStyle(path.join(stylesPath, `.inline.${options.styles.extension}`))),
    toArray(compileScript(path.join(scriptsPath, `.${options.scripts.extension}`))),
    toArray(compileScript(path.join(scriptsPath, `.inline.${options.scripts.extension}`))),
  ]).then(data => new PageCode(data));
}

function createDependenciesLoader(options: Options): (file: File) => Promise<PageDependencies> {
  const stylesPath = path.join(options.src.folder, options.styles.folder, 'main');
  const scriptsPath = path.join(options.src.folder, options.scripts.folder, 'main');

  const languagesPromise = toArray(fetchLanguages(options));
  const globalCodePromise = fetchCode(stylesPath, scriptsPath, options);

  return (file: File): Promise<PageDependencies> => {
    const pageCodeBasePath = replaceExtension(file.relative, '');
    const pageCodePromise = fetchCode(pageCodeBasePath, pageCodeBasePath, options);

    return Promise.all([
      languagesPromise,
      globalCodePromise,
      pageCodePromise,
    ]).then(data => {
      const [languages, globalCode, code] = data;
      return {languages, globalCode, code};
    });
  }
}

function fetchPages(options: Options): ReadWriteStream {
  const loadDependencies = createDependenciesLoader(options);

  return fetchPageFiles(options)
    .pipe(through2(function (file: File, enc: string, callback) {
      loadDependencies(file).then((dependencies: PageDependencies) => {
        dependencies.languages.forEach(language => this.push(createPage({file, language, dependencies})));

        callback();
      });
    }));
}

function compileStyle(glob: string): ReadWriteStream {
  return compileCode(glob, stylus());
}

function compileScript(glob: string): ReadWriteStream {
  return compileCode(glob, typescript());
}

function compileCode(glob: string, writableStream: ReadWriteStream): ReadWriteStream {
  return gulp.src(glob, {allowEmpty: true})
    .pipe(writableStream);
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

export function compilePages(options: Options): ReadWriteStream {
  return fetchPages(options)
    .pipe(through2((page: Page, e, cb) => {
      cb(null, page)
    }))
    .pipe(pug())
    .pipe(addPageLanguagePath(options))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Pages:'}))
    .pipe(exposeAssets(options))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Page assets:'}));
}
