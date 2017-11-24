import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from './interfaces/options';
import { Code } from './interfaces/code';
import { dist } from './utils/dist';
import { compileStylus } from './compilers/compile-stylus';
import { StylesCompiler } from './interfaces/styles-compiler';
import { createAbsoluteUrl } from './utils/create-absolute-url';

export function renderCss(page: string, options: Options): Code {
  const sourcePath = path.join(options.src.folder, options.pages.folder, page);
  const globalSourcePath = `${sourcePath}.${options.styles.extension}`;
  const inlineSourcePath = `${sourcePath}.inline.${options.styles.extension}`;
  const externalSourcePath = `${sourcePath}.external.${options.styles.extension}`;
  const externalDistPath = `${page}.css`;

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
  const compiler: StylesCompiler = getCompiler(options);

  return compiler(source, filename);
}

function getCompiler(options: Options): StylesCompiler {
  switch (options.styles.extension) {
    case 'styl':
    default:
      return compileStylus;
  }
}
