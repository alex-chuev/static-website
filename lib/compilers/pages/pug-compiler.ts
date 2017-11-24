import * as pug from 'pug';

import { Compiler } from '../compiler';

export class PugCompiler extends Compiler {
  method(src: string, data: any, file: string): string {
    return pug.render(src, {...data, filename: file});
  }
}
