import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import * as glob from 'glob';
import { AppConfig } from './app-config';
import { Code } from './code';
import { Environment } from '../interfaces/environment';
import { CodeConstructor } from '../interfaces/code-constructor';
import * as _ from 'lodash';

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
      .map(file => this.addCode(file));
  }

  removeCode(file: string): Code[] {
    return _.remove(this.items, item => item.file === file);
  }

  getCode(file: string): Code {
    return this.items.find(item => item.file === file);
  }

  addCode(file: string): Code {
    const code = new this.codeConstructor({
      file,
      host: this.host,
      config: this.config,
      environment: this.environment,
    });
    this.items.push(code);
    return code;
  }

  onWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
      case WatchAction.Unlink:
    }
  }

  dist() {
    Code.getExternal(this.items, this.environment).forEach(item => item.dist());
  }

}
