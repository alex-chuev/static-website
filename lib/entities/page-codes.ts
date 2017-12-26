import { Url } from '../types';
import { Code } from './code';
import { Environment } from '../interfaces/environment';

export class PageCodes {
  inline: string[] = [];
  external: Url[] = [];

  constructor(codes: Code[], private environment: Environment) {
    codes.forEach(code => this.add(code));
  }

  private add(code: Code) {
    if (this.environment.production) {
      code.inline ? this.inline.push(code.content) : this.external.push(code.url);
    } else {
      this.external.push(code.url);
    }
  }
}
