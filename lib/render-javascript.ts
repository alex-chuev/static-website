import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from './interfaces/options';
import { Code } from './interfaces/code';
import { dist } from './utils/dist';
import { ScriptsCompiler } from './interfaces/scripts-compiler';
import { compileTypescript } from './compilers/compile-typescript';
import { createAbsoluteUrl } from './utils/create-absolute-url';

export function renderJavascript(page: string, options: Options): Code {
  const sourcePath = path.join(options.src.folder, options.pages.folder, page);
  const globalSourcePath = `${sourcePath}.${options.scripts.extension}`;
  const inlineSourcePath = `${sourcePath}.inline.${options.scripts.extension}`;
  const externalSourcePath = `${sourcePath}.external.${options.scripts.extension}`;
  const externalDistPath = `${page}.js`;

  let global: string = null;
  let inline: string = null;
  let externalUrl: string = null;

  if (fs.existsSync(globalSourcePath)) {
    global = compile(globalSourcePath, options);
  }

  if (fs.existsSync(inlineSourcePath)) {
    inline = compile(inlineSourcePath, options);
  }

  if (fs.existsSync(externalSourcePath)) {
    dist(externalDistPath, compile(externalSourcePath, options), options);
    externalUrl = createAbsoluteUrl(externalDistPath, options);
  }

  return {
    global,
    inline,
    externalUrl,
  };
}

function compile(filename: string, options: Options): string {
  const source = fs.readFileSync(filename, 'utf8');
  const compiler: ScriptsCompiler = getCompiler(options);

  return compiler(source, options.scripts.options, filename);
}

function getCompiler(options: Options): ScriptsCompiler {
  switch (options.pages.extension) {
    case 'ts':
    default:
      return compileTypescript;
  }
}
