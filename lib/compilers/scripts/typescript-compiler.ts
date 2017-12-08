import * as ts from 'typescript';
import { minify } from 'uglify-js';

import { Compiler } from '../compiler';

export class TypescriptCompiler extends Compiler {
  method(src: string, data: any, file: string): string {
    return minify(ts.transpileModule(src, this.options.scripts.options).outputText).code;
  }
}
