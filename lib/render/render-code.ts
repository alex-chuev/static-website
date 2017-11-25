import * as path from 'path';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { Url } from '../types';
import { Options } from '../interfaces/options';
import { existsSync } from 'fs';
import { Compiler } from '../compilers/compiler';

export function renderCode(
  compiler: Compiler,
  srcFolder: string,
  srcExt: string,
  distExt: string,
  options: Options,
): Url {
  const srcPath = path.join(srcFolder, `index.${srcExt}`);
  const fullSrcPath = path.join(options.src.folder, srcPath);
  const distPath = `index.${distExt}`;

  if (existsSync(fullSrcPath)) {
    compiler.compileFile(srcPath, null, distPath);
    return createAbsoluteUrl(distPath, options);
  }
}
