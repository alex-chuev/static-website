import * as path from 'path';
import { existsSync } from 'fs';

import { Code } from '../interfaces/code';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { Compiler } from '../compilers/compiler';
import { State } from '../state';
import { FilePath } from '../types';

export function renderPageCode(
  page: FilePath,
  compiler: Compiler,
  srcExt: string,
  distExt: string,
  state: State,
): Code {
  const sourcePath = path.join(state.options.pages.folder, page);
  const externalSrcPath = `${sourcePath}.${srcExt}`;
  const inlineSrcPath = `${sourcePath}.inline.${srcExt}`;

  const inline = [];
  const external = [];

  if (existsSync(inlineSrcPath)) {
    inline.push(compiler.compileFromFile(inlineSrcPath, state.options));
  }

  if (existsSync(externalSrcPath)) {
    const externalDistPath = `${page}.${distExt}`;
    compiler.compileFile(externalSrcPath, state.options, externalDistPath);

    external.push(createAbsoluteUrl(externalDistPath, state.options));
  }

  return {
    inline,
    external,
  };
}
