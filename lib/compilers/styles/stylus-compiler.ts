import * as stylus from 'stylus';

import { Compiler } from '../compiler';

export class StylusCompiler extends Compiler {
  method(src: string, data: any, file: string): string {
    return stylus(src)
      .set('filename', file)
      .set('compress', true)
      .render();
  }
}
