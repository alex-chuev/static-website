import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as debug from 'gulp-debug';
import * as File from 'vinyl';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';
import ReadWriteStream = NodeJS.ReadWriteStream;
import toArray = require('stream-to-array');

export function promiseLanguages(config: Config): Promise<Language[]> {
  return toArray(getLanguageFiles(config))
    .then((files: File[]) => files.map(file => new Language(file, config)));
}

function getLanguageFiles(options: Config): ReadWriteStream {
  return vfs.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(debug({title: 'Found languages:', showFiles: false}));
}
