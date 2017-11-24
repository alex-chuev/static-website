import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from './interfaces/options';
import { Code } from './interfaces/code';
import { createAbsoluteUrl } from './utils/create-absolute-url';
import { Compiler } from './compilers/compiler';
import { TypescriptCompiler } from './compilers/scripts/typescript-compiler';

export function renderJavascript(page: string, options: Options): Code {
  const sourcePath = path.join(options.pages.folder, page);
  const globalSourcePath = `${sourcePath}.${options.scripts.extension}`;
  const inlineSourcePath = `${sourcePath}.inline.${options.scripts.extension}`;
  const externalSourcePath = `${sourcePath}.external.${options.scripts.extension}`;
  const externalDistPath = `${page}.js`;
  const compiler = getCompiler(options);

  let global: string = null;
  let inline: string = null;
  let externalUrl: string = null;

  if (fs.existsSync(globalSourcePath)) {
    global = compiler.compileFromFile(globalSourcePath, options);
  }

  if (fs.existsSync(inlineSourcePath)) {
    inline = compiler.compileFromFile(inlineSourcePath, options);
  }

  if (fs.existsSync(externalSourcePath)) {
    compiler.compileFile(inlineSourcePath, options, externalDistPath);
    externalUrl = createAbsoluteUrl(externalDistPath, options);
  }

  return {
    global,
    inline,
    externalUrl,
  };
}

function getCompiler(options: Options): Compiler {
  switch (options.pages.extension) {
    case 'ts':
    default:
      return new TypescriptCompiler(options);
  }
}
