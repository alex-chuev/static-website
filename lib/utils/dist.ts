import * as path from 'path';
import { outputFileSync } from 'fs-extra';
import { Options } from '../interfaces/options';
import { FilePath } from '../types';
import { ConsoleService } from '../services/console-service';

export function dist(filePath: FilePath, content: string, options: Options) {
  filePath = path.join(options.dist.folder, filePath);

  if (options.verbose) {
    ConsoleService.dist(filePath, options);
  }

  outputFileSync(filePath, content, options.dist.encoding);
}
