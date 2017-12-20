import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import * as File from 'vinyl';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import toArray = require('stream-to-array');
import * as glob from 'glob';
import { readJsonSync } from 'fs-extra';

export function promiseLanguages(config: Config): Promise<Language[]> {
  return toArray(getLanguageFiles(config))
    .then((files: File[]) => files.map(file => new Language(path.parse(file.path).name, JSON.parse(file.contents.toString()), config)));
}

function getLanguageFiles(options: Config): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(debug({title: 'Language files:'}));
}

export function getLanguages(config: Config): Language[] {
  return glob.sync(path.join(config.src.folder, config.translations.folder, `*.${config.translations.extension}`))
    .map(file => {
      const name = path.parse(file).name;
      const translation = readJsonSync(file);

      return new Language(name, translation, config);
    });
}
