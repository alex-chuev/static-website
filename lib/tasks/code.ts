import * as gulp from 'gulp';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Config } from '../interfaces/config';
import { Code } from '../entities/code';
import { compileStyle } from './styles';
import * as path from 'path';
import { compileScript } from './scripts';
import { Language } from '../entities/language';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import * as File from 'vinyl';
import { removeExtension } from '../helpers/path-helpers';
import { toPromise } from '../helpers/to-promise';

export function compileCode(glob: string, writableStream: ReadWriteStream): ReadWriteStream {
  return gulp.src(glob, {allowEmpty: true})
    .pipe(writableStream);
}

export function promiseCode(config: Config, file?: File, language?: Language): Promise<Code> {
  const code = new Code();

  let baseScriptsPath: string;
  let baseStylesPath: string;

  if (language) {
    baseStylesPath = baseScriptsPath = removeExtension(file.path) + '.' + language.name;
  } else if (file) {
    baseStylesPath = baseScriptsPath = removeExtension(file.path);
  } else {
    baseStylesPath = path.join(config.src.folder, config.styles.folder, 'main');
    baseScriptsPath = path.join(config.src.folder, config.scripts.folder, 'main');
  }

  return Promise.all([
    toPromise<File>(compileStyle(baseStylesPath + `.inline.${config.styles.extension}`))
      .then(file => file && code.css.inline.push(file.contents.toString())),

    toPromise<File>(compileStyle(baseStylesPath + `.${config.styles.extension}`).pipe(gulp.dest(config.dist.folder)))
      .then(file => file && code.css.external.push(createAbsoluteUrl(file.relative, config))),

    toPromise<File>(compileScript(baseScriptsPath + `.inline.${config.scripts.extension}`))
      .then(file => file && code.js.inline.push(file.contents.toString())),

    toPromise<File>(compileScript(baseScriptsPath + `.${config.scripts.extension}`).pipe(gulp.dest(config.dist.folder)))
      .then(file => file && code.js.external.push(createAbsoluteUrl(file.relative, config))),
  ]).then(data => code);
}
