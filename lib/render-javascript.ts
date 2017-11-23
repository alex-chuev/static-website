import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from './interfaces/options';
import { Code } from './interfaces/code';
import { dist } from './utils/dist';

export function renderJavascript(page: string, options: Options): Code {
  const sourcePath = path.join(options.pagesFolder, page);
  const globalSourcePath = `${sourcePath}.${options.scriptsExtension}`;
  const inlineSourcePath = `${sourcePath}.inline.${options.scriptsExtension}`;
  const externalSourcePath = `${sourcePath}.external.${options.scriptsExtension}`;
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
    externalUrl = options.rootUrl + externalDistPath;
  }

  return {
    global,
    inline,
    externalUrl,
  };
}

function compile(filename: string, options: Options): string {
  const source = fs.readFileSync(filename, 'utf8');

  return options.scriptsCompiler(source, options.scriptsCompilerOptions, filename);
}
