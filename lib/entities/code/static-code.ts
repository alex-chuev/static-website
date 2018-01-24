import { Code } from './code';
import { AppConfig } from '../app/app-config';

export class StaticCode extends Code {

  static getExternal(codes: StaticCode[], config: AppConfig): StaticCode[] {
    return config.production ? codes.filter(code => code.external) : codes;
  }

  get css(): boolean {
    return this.file.extension === 'css';
  }

  get js(): boolean {
    return this.file.extension === 'js';
  }

}
