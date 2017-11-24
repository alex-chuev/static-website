import * as fs from 'fs-extra';
import * as path from 'path';

import { Options } from '../interfaces/options';

export function dist(filePath: string, data: any, options: Options) {
  filePath = path.join(options.dist.folder, filePath);

  if (options.verbose) {
    console.info(`> ${path.relative(process.cwd(), filePath)}`);
  }

  fs.outputFileSync(filePath, data, options.dist.encoding);
}
