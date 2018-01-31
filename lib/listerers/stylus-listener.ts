import { Listener } from './listener';
import { App } from '../entities/app/app';
import { FileObject } from '../entities/file-object';
import { Compiler } from '../entities/compiler/compiler';

export class StylusListener extends Listener {

  constructor(app: App, private compiler: Compiler) {
    super(app);
  }

  test(file: FileObject): boolean {
    return false;
  }

  add(file: FileObject) {
  }

  change(file: FileObject) {
  }

  unlink(file: FileObject) {
  }

}
