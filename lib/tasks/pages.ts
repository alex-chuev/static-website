import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import { obj as through2 } from 'through2';
import { Page, PageData, PageFile } from '../entities/page';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Language } from '../entities/language';
import { toPromise } from '../helpers/to-promise';
import { promiseCode } from './code';
import { Environment } from '../interfaces/environment';
import { PagePromises } from '../interfaces/page-promises';
import * as File from 'vinyl';
import { Code } from '../entities/code';
import * as glob from 'glob';

export function promiseCompilePages(config: Config, environment: Environment, languages: Language[]): Promise<PageFile[]> {
  return toPromise(emitCompiledPages(config, environment, languages));
}

function emitCompiledPages(config: Config, environment: Environment, languages: Language[]): ReadWriteStream {
  const globalCodePromise = promiseCode(config);

  return emitPageFiles()
    .pipe(emitLanguagePages())
    .pipe(pug())
    .pipe(gulp.dest((page: PageFile) => path.join(config.dist.folder, page.data.language.url)))
    .pipe(debug({title: 'Pages:'}));

  function emitPageFiles(): ReadWriteStream {
    return gulp.src(path.join(config.src.folder, config.pages.folder, `**/*.${config.pages.extension}`))
      .pipe(debug({title: 'Page files:'}));
  }

  function emitLanguagePages(): ReadWriteStream {
    return through2(function (file: File, enc, callback) {
      const pagePromises: PagePromises = createLanguagePages(file);

      pagePromises.forEach(pagePromise =>
        pagePromise.then((page: PageFile) => this.push(page))
      );

      Promise.all(pagePromises).then(pages => callback());
    })
  }

  function createLanguagePages(file: File): PagePromises {
    const pageCodePromise = promiseCode(config, file);

    return languages.map(language => {
      const pageLanguageCodePromise = promiseCode(config, file, language);

      return Promise.all([globalCodePromise, pageCodePromise, pageLanguageCodePromise])
        .then(codes => {
          const code = codes.reduce((result, item) => result.append(item), new Code());
          const page = file.clone();
          page.data = new PageData({config, languages, file, language, code, environment});
          return page as PageFile;
        });
    });
  }
}

export function getPages(config: Config): Page[] {
  return glob.sync(path.join(config.src.folder, config.pages.folder, `**/*.${config.pages.extension}`))
    .map(file => new Page(file));
}
