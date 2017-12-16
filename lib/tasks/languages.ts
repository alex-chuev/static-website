import * as path from 'path';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import { obj as through2 } from 'through2';
import { File } from 'gulp-util';
import { Language } from '../entities/language';
import { Options } from '../interfaces/options';
import ReadWriteStream = NodeJS.ReadWriteStream;

export function fetchLanguages(options: Options): ReadWriteStream {
  return gulp.src(path.join(options.src.folder, options.translations.folder, `*.${options.translations.extension}`))
    .pipe(debug({title: 'Found languages:', showFiles: false}))
    .pipe(through2(function (file: File, enc: string, callback) {
      callback(null, new Language(file, options));
    }));
}

