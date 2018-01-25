import * as path from 'path';
import { readFileSync } from 'fs';
import { PathHelpers } from '../helpers/path-helpers';
import { outputJsonSync, readJsonSync } from 'fs-extra';

export class FileObject {

  absolutePath: string;
  absolutePathWithoutExt: string;

  constructor(filePath: string) {
    this.absolutePath = path.resolve(filePath);
    this.absolutePathWithoutExt = PathHelpers.removeExtension(this.absolutePath);
  }

  get name(): string {
    return path.parse(this.absolutePath).name;
  }

  get extension(): string {
    return PathHelpers.getExtension(this.absolutePath);
  }

  get slashPath(): string {
    return this.slash(this.relative(this.absolutePath));
  }

  get slashPathWithoutExt(): string {
    return this.slash(this.relative(this.absolutePathWithoutExt));
  }

  private relative(filePath: string): string {
    return path.relative(process.cwd(), filePath);
  }

  private slash(filePath: string): string {
    return './' + filePath.replace(/\\+/g, '/');
  }

  read(): string {
    return readFileSync(this.absolutePath, 'utf-8');
  }

  readJson(): object {
    return readJsonSync(this.absolutePath);
  }

  writeJson(content: object): void {
    outputJsonSync(this.absolutePath, content, {spaces: 2});
  }

}
