import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';

export class LayoutsListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.layoutsGlob);
  }

  add(file: FileObject) {
    this.app.pages.build();
  }

  change(file: FileObject) {
    this.app.pages.build();
  }

  unlink(file: FileObject) {
    this.app.pages.build();
  }

}
