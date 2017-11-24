import * as ts from 'typescript';

import { Compiler } from '../compiler';

export class TypescriptCompiler extends Compiler {
  method(src: string, data: any, file: string): string {
    return ts.transpileModule(src, this.options.scripts.options).outputText;
  }
}
