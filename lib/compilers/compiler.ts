import * as path from 'path';

import { Options } from '../interfaces/options';
import { dist } from '../utils/dist';
import { src } from '../utils/src';
import { FilePath } from '../types';

export abstract class Compiler {

  abstract method(src: string, data: any, file: string): string;

  constructor(public options: Options) {
  }

  compileFile(filePath: FilePath, data: any, distFilePath: FilePath) {
    this.dist(distFilePath, this.compileFromFile(filePath, data));
  }

  compileFromFile(filePath: FilePath, data: any): string {
    return this.method(src(filePath, this.options), data, path.join(this.options.src.folder, filePath));
  }

  protected dist(filePath: FilePath, content: string) {
    dist(filePath, content, this.options);
  }
}
