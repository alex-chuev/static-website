import * as gulp from 'gulp';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Options } from '../interfaces/options';
import { PageCode } from '../entities/page-code';
import toArray = require('stream-to-array');
import { compileStyle } from './styles';
import * as path from 'path';
import { compileScript } from './scripts';
import { PageDependencies } from '../entities/page';
import { fetchLanguages } from './languages';
import { File, replaceExtension } from 'gulp-util';

export function compileCode(glob: string, writableStream: ReadWriteStream): ReadWriteStream {
  return gulp.src(glob, {allowEmpty: true})
    .pipe(writableStream);
}

export function fetchCode(stylesPath: string, scriptsPath: string, options: Options): Promise<PageCode> {
  return Promise.all([
    toArray(compileStyle(path.join(stylesPath, `.${options.styles.extension}`))),
    toArray(compileStyle(path.join(stylesPath, `.inline.${options.styles.extension}`))),
    toArray(compileScript(path.join(scriptsPath, `.${options.scripts.extension}`))),
    toArray(compileScript(path.join(scriptsPath, `.inline.${options.scripts.extension}`))),
  ]).then(data => new PageCode(data));
}

export function createDependenciesLoader(options: Options): (file: File) => Promise<PageDependencies> {
  const stylesPath = path.join(options.src.folder, options.styles.folder, 'main');
  const scriptsPath = path.join(options.src.folder, options.scripts.folder, 'main');

  const languagesPromise = toArray(fetchLanguages(options));
  const globalCodePromise = fetchCode(stylesPath, scriptsPath, options);

  return (file: File): Promise<PageDependencies> => {
    const pageCodeBasePath = replaceExtension(file.relative, '');
    const pageCodePromise = fetchCode(pageCodeBasePath, pageCodeBasePath, options);

    return Promise.all([
      languagesPromise,
      globalCodePromise,
      pageCodePromise,
    ]).then(data => {
      const [languages, globalCode, code] = data;
      return {languages, globalCode, code};
    });
  }
}
