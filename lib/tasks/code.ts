import * as vfs from 'vinyl-fs';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { Config } from '../interfaces/config';
import { Code } from '../entities/code';
import toArray = require('stream-to-array');
import { compileStyle } from './styles';
import * as path from 'path';
import { compileScript } from './scripts';
import { Language } from '../entities/language';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import * as File from 'vinyl';
import { removeExtension } from '../helpers/path-helpers';

export function compileCode(glob: string, writableStream: ReadWriteStream): ReadWriteStream {
  return vfs.src(glob, {allowEmpty: true})
    .pipe(writableStream);
}

export function fetchCode(basePath: string, config: Config): Promise<Code> {
  const code = new Code();

  return Promise.all([
    toArray(compileStyle(path.join(basePath, `.inline.${config.styles.extension}`))),
    toArray(compileStyle(path.join(basePath, `.${config.styles.extension}`))),
    toArray(compileScript(path.join(basePath, `.inline.${config.scripts.extension}`))),
    toArray(compileScript(path.join(basePath, `.${config.scripts.extension}`))),
  ]).then(data => code.append({
    css: {
      inline: data[0].map((file: File) => file.contents.toString()),
      external: data[1].map((file: File) => createAbsoluteUrl(file.relative, config)),
    },
    js: {
      inline: data[2].map((file: File) => file.contents.toString()),
      external: data[3].map((file: File) => createAbsoluteUrl(file.relative, config)),
    },
  }));
}

export function promiseCode(config: Config, file?: File, language?: Language): Promise<Code> {
  let basePath: string;

  if (language) {
    basePath = path.join(removeExtension(file.relative), language.name);
  } else if (file) {
    basePath = removeExtension(file.relative);
  } else {
    basePath = config.src.folder + 'main';
  }

  return fetchCode(basePath, config);
}

export function promiseGlobalCode(config: Config): Promise<Code> {
  return promiseCode(config);
}
