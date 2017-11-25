import * as path from 'path';
import { readFileSync } from 'fs';
import { Options } from '../interfaces/options';

export function src(file: string, options: Options): string {
  return readFileSync(path.join(options.src.folder, file), 'utf-8');
}
