import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as debug from 'gulp-debug';
import * as pug from 'gulp-pug';
import { obj as through2 } from 'through2';
import * as File from 'vinyl';
import { PageFile, PageData, PageDataProps } from '../entities/page';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { promiseLanguages } from './languages';
import { Code } from '../entities/code';
import { Language } from '../entities/language';
import toArray = require('stream-to-array');
import { generateSitemap } from './sitemap';
import { promiseCode } from './code';
import * as stream from 'stream';
import { Environment } from '../interfaces/environment';

const compilePageTemplates = pug();
const savePages = (page: PageFile) => vfs.dest(path.join(page.data.options.dist.folder, page.data.language.url));

export function promisePages(config: Config, environment: Environment, languages: Language[]): Promise<PageFile[]> {
  return toArray(fetchPages(config, environment, languages));
}

function fetchPages(config: Config, environment: Environment, languages: Language[]): ReadWriteStream {
  const globalCodePromise = promiseCode(config);

  return getPageFiles(config)
    .pipe(through2(function (file, enc, callback) {
      createPages(config, file, globalCodePromise, languages)
        .then(pages => {
          pages.forEach(page => this.push(page));
          callback();
        })
    }));
}

async function createPages(config: Config, file: File, globalCodePromise: Promise<Code>, languages: Language[]): Promise<PageFile[]> {
  const globalCode = await globalCodePromise;
  const pageCode = await promiseCode(config, file);
  const pages: PageFile[] = [];

  languages.forEach(async language => {
    const pageLanguageCode = await promiseCode(config, file, language);
    const code = globalCode.append(pageCode).append(pageLanguageCode);
    pages.push(createPage({config, languages, file, language, code}));
  });

  return pages;
}

function getPageFiles(config: Config): ReadWriteStream {
  return vfs.src(path.join(config.src.folder, config.pages.folder, `**/*.${config.pages.extension}`))
    .pipe(debug({title: 'Found pages:', showFiles: false}));
}

function createPage(props: PageDataProps): PageFile {
  const page = props.file.clone();
  page.data = new PageData(props);
  return page as PageFile;
}
