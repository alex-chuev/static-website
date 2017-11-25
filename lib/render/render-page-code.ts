import * as path from 'path';

import { Code } from '../interfaces/code';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { Compiler } from '../compilers/compiler';
import { State } from '../state';
import { FilePath } from '../types';
import { srcExists } from '../utils/src-exists';

export function renderPageCode(
  page: FilePath,
  compiler: Compiler,
  srcExt: string,
  distExt: string,
  state: State,
): Code {
  const baseSrcPath = path.join(state.options.pages.folder, page);
  const inlineSrcPath = `${baseSrcPath}.inline.${srcExt}`;
  const externalSrcPath = `${baseSrcPath}.${srcExt}`;

  const inline = [];
  const external = [];

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
