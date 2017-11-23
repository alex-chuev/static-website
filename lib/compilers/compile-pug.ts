import * as pug from 'pug';
import { PagesCompilerOptions } from '../interfaces/pages-compiler-options';

export function compilePug(source: string, options?: PagesCompilerOptions): string {
  return pug.render(source, options);
}
