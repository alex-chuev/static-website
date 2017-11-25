import * as path from 'path';
import { existsSync } from 'fs';

import { FilePath } from '../types';
import { Options } from '../interfaces/options';

export function srcExists(filePath: FilePath, options: Options): boolean {
  return existsSync(path.join(options.src.folder, filePath));
}
