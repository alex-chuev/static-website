import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from './interfaces/options';
import { Code } from './interfaces/code';
import { dist } from './utils/dist';
import { compileStylus } from './compilers/compile-stylus';

export function renderCss(page: string, options: Options): Code {
  const sourcePath = path.join(options.pagesFolder, page);
  const globalSourcePath = `${sourcePath}.${options.styleExtension}`;
  const inlineSourcePath = `${sourcePath}.inline.${options.styleExtension}`;
  const externalSourcePath = `${sourcePath}.external.${options.styleExtension}`;
  const externalDistPath = `${page}.css`;

  let global: string = null;
  let inline: string = null;
  let externalUrl: string = null;

  if (fs.existsSync(globalSourcePath)) {
    global = compile(globalSourcePath);
  }

  if (fs.existsSync(inlineSourcePath)) {
    inline = compile(inlineSourcePath);
  }

  if (fs.existsSync(externalSourcePath)) {
    dist(externalDistPath, compile(externalSourcePath), options);
    externalUrl = options.rootUrl + externalDistPath;
  }

  return {
    global,
    inline,
    externalUrl,
  };
}

function compile(filename: string): string {
  const source = fs.readFileSync(filename, 'utf8');

  return compileStylus(source, filename);
}
