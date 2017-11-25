import { Compiler } from '../compilers/compiler';

export interface Compilers {
  templates: Compiler;
  styles: Compiler;
  scripts: Compiler;
}
