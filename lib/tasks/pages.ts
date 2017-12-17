import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import { exposePageAssets } from './assets';
import { obj as through2 } from 'through2';
import { File } from 'gulp-util';
import { Page, PageData, PageDataProps, PageDependencies } from '../entities/page';
import { Options } from '../interfaces/options';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { createDependenciesLoader } from './code';

export function compilePages(options: Options): ReadWriteStream {
  return fetchPages(options)
    .pipe(pug())
    .pipe(gulp.dest((page: Page) => path.join(options.dist.folder, page.data.language.url)))
    .pipe(debug({title: 'Pages:'}))
    .pipe(exposePageAssets(options))
    .pipe(gulp.dest(options.dist.folder))
    .pipe(debug({title: 'Page assets:'}));
}

function fetchPageFiles(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(debug({title: 'Found pages:', showFiles: false}));
}

function createPage(props: PageDataProps): Page {
  const page = props.file.clone();
  page.data = new PageData(props);
  return page as Page;
}

function fetchPages(options: Options): ReadWriteStream {
  const loadDependencies = createDependenciesLoader(options);

  return fetchPageFiles(options)
    .pipe(through2(function (file: File, enc: string, callback) {
      loadDependencies(file).then((dependencies: PageDependencies) => {
        dependencies.languages.forEach(language => this.push(createPage({
          file,
          language,
          options,
          dependencies,
        })));

        callback();
      });
    }));
}
