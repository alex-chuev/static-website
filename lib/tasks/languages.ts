import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import { File } from 'gulp-util';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import toArray = require('stream-to-array');

export function getLanguageFiles(options: Config): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(debug({title: 'Found languages:', showFiles: false}));
}

export function promiseLanguages(config: Config): Promise<Language[]> {
  return toArray(getLanguageFiles(config))
    .then((files: File[]) => files.map(file => new Language(file, config)));
}
