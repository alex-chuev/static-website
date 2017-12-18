import * as path from 'path';
import * as gulp from 'gulp';
import * as vfs from 'vinyl-fs';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import { obj as through2 } from 'through2';
import { File } from 'gulp-util';
import { Page, PageData, PageDataProps } from '../entities/page';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { promiseLanguages } from './languages';
import { createConfig } from '../cli/utils/load-options';
import { Code } from '../entities/code';
import { Language } from '../entities/language';
import toArray = require('stream-to-array');
import { generateSitemap } from './sitemap';
import { getCode } from './code';

const compilePageTemplates = pug();
const savePages = (page: Page) => vfs.dest(path.join(page.data.options.dist.folder, page.data.language.url));

export function compilePages(options: Config): ReadWriteStream {
  return vfs.src('static-website.json')
    .pipe(createConfig)
    .pipe(createPages)
    .pipe(compilePageTemplates)
    .pipe(savePages)
    .pipe(generateSitemap)
    .pipe(debug({title: 'Pages:'}));
}

function getPageFiles(options: Config): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.pages.folder, `**/*.${options.pages.extension}`))
    .pipe(debug({title: 'Found pages:', showFiles: false}));
}

function promisePageFiles(config: Config): Promise<File[]> {
  return toArray(getPageFiles(config));
}

function createPage(props: PageDataProps): Page {
  const page = props.file.clone();
  page.data = new PageData(props);
  return page as Page;
}

const createPages = through2(async (config: Config, enc, cb) => {
  const files: File[] = await promisePageFiles(config);
  const languages: Language[] = await promiseLanguages(config);
  const globalCode: Code = await getCode(config);

  files.forEach(async file => {
    const pageCode: Code = await getCode(config, file);

    languages.forEach(async language => {
      const pageLanguageCode: Code = await getCode(config, file, language);

      const code = globalCode.append(pageCode).append(pageLanguageCode);

      this.push(createPage({
        config,
        languages,
        file,
        language,
        code,
      }));
    });

    cb();
  });
});
