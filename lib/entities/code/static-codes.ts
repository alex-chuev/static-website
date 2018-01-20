import { AppConfig } from '../app/app-config';
import { StaticCodesFactory } from '../../factories/static-codes-factory';
import { StaticCode } from './static-code';
import { Style } from './style';
import { Script } from './script';
import { StaticCodePathConfig } from '../../interfaces/static-code-path';
import { FileObject } from '../file-object';
import * as _ from 'lodash';

export class StaticCodes {

  items: StaticCode[] = [];

  constructor(pathConfigs: StaticCodePathConfig[], config: AppConfig) {
    this.items = StaticCodesFactory.create(pathConfigs, config);
  }

  dist() {
    this.items.forEach(item => item.dist());
  }

  get css(): Style[] {
    return this.items.filter(item => item instanceof Style);
  }

  get js(): Script[] {
    return this.items.filter(item => item instanceof Script);
  }

  getCode(file: FileObject): StaticCode {
    return this.items.find(item => item.file.absolutePath === file.absolutePath);
  }

  removeCode(file: FileObject): StaticCode {
    return _.first(_.remove(this.items, item => item.file.absolutePath === file.absolutePath));
  }

}
