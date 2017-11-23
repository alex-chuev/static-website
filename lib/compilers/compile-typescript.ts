import * as ts from "typescript";
import { ScriptsCompilerOptions } from '../interfaces/scripts-compiler-options';

export function compileTypescript(source: string, options: ScriptsCompilerOptions, filename?: string): string {
  return ts.transpileModule(source, options).outputText;
}
