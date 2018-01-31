import { AppConfig } from '../app/app-config';
import * as glob from 'glob';
import { StaticCode } from './static-code';
import { FileObject } from '../file-object';
import * as _ from 'lodash';

export class StaticCodes {

  items: StaticCode[] = [];

  constructor(root: string, pattern: string, private config: AppConfig) {
    this.items = glob.sync(pattern)
      .map(filePath => new FileObject(filePath))
      .map(file => new StaticCode(file, root, config));
  }

  dist() {
    this.externalCode.forEach(item => item.dist());
  }

  get externalCode(): StaticCode[] {
    return StaticCode.getExternal(this.items, this.config);
  }

  get css(): StaticCode[] {
    return this.items.filter(item => item.file.extension === 'css');
  }

  get js(): StaticCode[] {
    return this.items.filter(item => item.file.extension === 'js');
  }

  getCode(file: FileObject): StaticCode {
    return this.items.find(item => item.file.absolutePath === file.absolutePath);
  }

  removeCode(file: FileObject): StaticCode {
    return _.first(_.remove(this.items, item => item.file.absolutePath === file.absolutePath));
  }

}
