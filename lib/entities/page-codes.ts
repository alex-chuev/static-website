import { Url } from '../types';
import { Code } from './code';

export class PageCodes {
  inline: string[] = [];
  external: Url[] = [];

  constructor(codes: Code[], production: boolean) {
    codes.forEach(code => {
      if (production) {
        code.inline ? this.inline.push(code.content) : this.external.push(code.url);
      } else {
        this.external.push(code.url);
      }
    });
  }
}
