import * as glob from 'glob';
import { AppConfig } from './app-config';
import { Code } from './code';
import { CodeConstructor } from '../interfaces/code-constructor';
import * as _ from 'lodash';
import * as path from 'path';

export class Codes {

  items: Code[] = [];

  constructor(
    protected host: string,
    protected base: string,
    ext: string,
    protected codeConstructor: CodeConstructor,
    protected config: AppConfig,
  ) {
    glob.sync(`${base}?(.inline).${ext}`)
      .map(file => this.addCode(path.resolve(file)));
  }

  removeCodeByAbsolutePath(absolutePath: string): Code {
    return _.first(_.remove(this.items, item => item.absolutePath === absolutePath));
  }

  getCodeByAbsolutePath(absolutePath: string): Code {
    return this.items.find(item => item.absolutePath === absolutePath);
  }

  addCode(absolutePath: string): Code {
    const code = new this.codeConstructor({
      absolutePath,
      host: this.host,
      config: this.config,
    });
    this.items.push(code);
    return code;
  }

  dist() {
    Code.getExternal(this.items, this.config).forEach(item => item.dist());
  }

}
