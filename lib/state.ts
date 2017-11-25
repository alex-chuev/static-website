import * as _ from 'lodash';

import { FilePath, Url } from './types';
import { Translation } from './interfaces/translation';
import { Options } from './interfaces/options';
import { Compilers } from './interfaces/compilers';

class Data {
  options: Options;
  pages: FilePath[];
  translations: Translation[];
  compilers: Compilers;
  css: Url;
  js: Url;
}

export class State extends Data {
  constructor(data: Data) {
    super();

    _.assign(this, data);
  }
}
