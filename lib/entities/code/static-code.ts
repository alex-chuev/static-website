import { Code } from './code';
import { AppConfig } from '../app/app-config';
import { FileObject } from '../file-object';

export abstract class StaticCode extends Code {

  static test(file: FileObject, config: AppConfig): boolean {
    return false;
  }

  static getExternal(codes: StaticCode[], config: AppConfig): StaticCode[] {
    return config.production ? codes.filter(code => code.external) : codes;
  }

  updateContent() {
    this.content = this.compile(this.file.read());
  }

}
