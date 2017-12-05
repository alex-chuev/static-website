import * as _ from 'lodash';

import { FilePath, Url } from './types';
import { Options } from './interfaces/options';
import { Compilers } from './interfaces/compilers';
import { Language } from './entities/language';
import { Environment } from './interfaces/environment';

class Data {
  options: Options;
  environment: Environment;
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
