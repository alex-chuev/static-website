import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import * as glob from 'glob';
import { AppConfig } from './app-config';
import { Code } from './code';
import { Environment } from '../interfaces/environment';
import { CodeConstructor } from '../interfaces/code-constructor';

export class Codes {

  items: Code[] = [];

  constructor(
    host: string,
    base: string,
    ext: string,
    constructor: CodeConstructor,
    config: AppConfig,
    protected environment: Environment,
  ) {
    glob.sync(`${base}?(.inline).${ext}`)
      .map(file => new constructor({file, host, config, environment}))
      .forEach(code => this.items.push(code));
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
