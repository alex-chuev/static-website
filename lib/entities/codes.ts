import * as glob from 'glob';
import { AppConfig } from './app-config';
import { Code } from './code';
import { Environment } from '../interfaces/environment';
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
    protected environment: Environment,
  ) {
    glob.sync(`${base}?(.inline).${ext}`)
      .map(file => this.addCode(path.resolve(file)));
  }

  removeCode(absolutePath: string): Code[] {
    return _.remove(this.items, item => item.absolutePath === absolutePath);
  }

  getCode(absolutePath: string): Code {
    return this.items.find(item => item.absolutePath === absolutePath);
  }

  addCode(absolutePath: string): Code {
    const code = new this.codeConstructor({
      absolutePath,
      host: this.host,
      config: this.config,
      environment: this.environment,
    });
    this.items.push(code);
    return code;
  }

  dist() {
    Code.getExternal(this.items, this.environment).forEach(item => item.dist());
  }

}
