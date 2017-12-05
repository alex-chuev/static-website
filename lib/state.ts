import * as _ from 'lodash';

import { FilePath, Url } from './types';
import { Options } from './interfaces/options';
import { Compilers } from './interfaces/compilers';
import { Language } from './entities/language';

class Data {
  options: Options;
  pages: FilePath[];
  languages: Language[];
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
