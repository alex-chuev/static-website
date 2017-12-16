import * as typescript from 'gulp-typescript';
import ReadWriteStream = NodeJS.ReadWriteStream;
import { compileCode } from './code';

export function compileScript(glob: string): ReadWriteStream {
  return compileCode(glob, typescript());
}
