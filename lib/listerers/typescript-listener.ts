import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';

export class TypescriptListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.pagesCodeGlob) &&
      minimatch(file.absolutePath, this.app.config.appCodeGlob);
  }

  add(file: FileObject) {
  }

  change(file: FileObject) {
  }

  unlink(file: FileObject) {
  }

}
