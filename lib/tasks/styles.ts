import * as stylus from 'gulp-stylus';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { compileCode } from './code';

export function compileStyle(glob: string): ReadWriteStream {
  return compileCode(glob, stylus());
}
