import { PagesCompilerOptions } from './pages-compiler-options';

export interface PagesCompiler {
  (source: string, options?: PagesCompilerOptions, filename?: string): string;
}
