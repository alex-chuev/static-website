import { Config } from '../interfaces/config';
import { Language } from '../entities/language';
import { toPromise } from '../helpers/to-promise';
import * as File from 'vinyl';
import * as gulp from 'gulp';
import * as debug from 'gulp-debug';
import { StreamArray } from '../entities/stream-array';
import * as path from 'path';
import ReadWriteStream = NodeJS.ReadWriteStream;

export function promiseUpdateTranslations(config: Config, languages: Language[]): Promise<void> {
  return toPromise<void>(updateTranslations(config, languages));
}

function updateTranslations(config: Config, languages: Language[]): ReadWriteStream {
  return new StreamArray(createUpdatedLanguageFiles(languages))
    .pipe(gulp.dest(path.join(config.src.folder, config.translations.folder)))
    .pipe(debug({title: 'Updated languages:'}));
}

function createUpdatedLanguageFiles(languages: Language[]): File[] {
  return languages
    .filter(language => language.updated)
    .map(language => {
      const file = language.file.clone({
        contents: false,
      });
      file.contents = new Buffer(JSON.stringify(language.translation));
      return file;
    });
}
