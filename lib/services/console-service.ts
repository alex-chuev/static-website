import * as path from 'path';
import { Options } from '../interfaces/options';

export class ConsoleService {
  static error(message: string, options: Options) {
    console.log(`\x1b[31m${message}\x1b[0m`);
  }

  static success(message: string, options: Options) {
    console.log(`\x1b[32m${message}\x1b[0m`);
  }

  static dist(file: string, options: Options) {
    console.log(`\x1b[33m> ${path.relative(options.dist.folder, file)}\x1b[0m`);
  }
}
