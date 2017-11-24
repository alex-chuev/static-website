import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from '../interfaces/options';

export abstract class Compiler {

  abstract method(src: string, data: any, file: string): string;

  constructor(
    public options: Options,
  ) {
  }

  compileFile(srcFile: string, data: any, distFile: string) {
    this.saveFile(distFile, this.compileFromFile(srcFile, data));
  }

  compileFromFile(srcFile: string, data: any): string {
    srcFile = path.join(this.options.src.folder, srcFile);

    return this.method(this.readFile(srcFile), data, srcFile);
  }

  compileToFile(src: string, data: any, distFile: string) {
    this.saveFile(distFile, this.method(src, data, null));
  }

  protected readFile(file: string): string {
    return fs.readFileSync(file, 'utf8');
  }

  protected saveFile(file: string, content: string) {
    file = path.join(this.options.dist.folder, file);

    if (this.options.verbose) {
      console.info(`> ${path.relative(process.cwd(), file)}`);
    }

    fs.outputFileSync(file, content, this.options.dist.encoding);
  }
}
