import * as path from 'path';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { Url } from '../types';
import { Options } from '../interfaces/options';
import { srcExists } from '../utils/src-exists';
import { Compiler } from '../compilers/compiler';

export function renderCode(
  compiler: Compiler,
  srcFolder: string,
  srcExt: string,
  distExt: string,
  options: Options,
): Url {
  const srcPath = path.join(srcFolder, `main.${srcExt}`);
  const distPath = `main.${distExt}`;

  if (srcExists(srcPath, options)) {
    compiler.compileFile(srcPath, null, distPath);
    return createAbsoluteUrl(distPath, options);
  }
}
