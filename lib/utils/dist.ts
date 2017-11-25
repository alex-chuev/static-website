import * as path from 'path';
import { outputFileSync } from 'fs-extra';
import { Options } from '../interfaces/options';
import { FilePath } from '../types';

export function dist(filePath: FilePath, content: string, options: Options) {
  filePath = path.join(options.dist.folder, filePath);

  if (options.verbose) {
    console.info(`> ${path.relative(process.cwd(), filePath)}`);
  }

  outputFileSync(filePath, content, options.dist.encoding);
}
