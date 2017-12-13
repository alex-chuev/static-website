import * as path from 'path';

import { Code } from '../entities/code';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { Compiler } from '../compilers/compiler';
import { State } from '../state';
import { FilePath } from '../types';
import { srcExists } from '../utils/src-exists';
import { Language } from '../entities/language';

export function renderPageCode(
  page: FilePath,
  language: Language,
  compiler: Compiler,
  srcExt: string,
  distExt: string,
  state: State,
): Code {
  const baseSrcPath = path.join(state.options.pages.folder, page);
  const languageInlineSrcPath = `${baseSrcPath}.inline.${language.name}.${srcExt}`;
  const languageExternalSrcPath = `${baseSrcPath}.${language.name}.${srcExt}`;
  const inlineSrcPath = `${baseSrcPath}.inline.${srcExt}`;
  const externalSrcPath = `${baseSrcPath}.${srcExt}`;

  const inline = [];
  const external = [];

  if (srcExists(languageInlineSrcPath, state.options)) {
    inline.push(compiler.compileFromFile(languageInlineSrcPath, null));
  }

  if (srcExists(languageExternalSrcPath, state.options)) {
    const externalDistPath = `${page}.${language.name}.${distExt}`;

    compiler.compileFile(languageExternalSrcPath, null, externalDistPath);

    external.push(createAbsoluteUrl(externalDistPath, state.options));
  }

  if (srcExists(inlineSrcPath, state.options)) {
    inline.push(compiler.compileFromFile(inlineSrcPath, null));
  }

  if (srcExists(externalSrcPath, state.options)) {
    const externalDistPath = `${page}.${distExt}`;

    compiler.compileFile(externalSrcPath, null, externalDistPath);

    external.push(createAbsoluteUrl(externalDistPath, state.options));
  }

  return {
    inline,
    external,
  };
}
