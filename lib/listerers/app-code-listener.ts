import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';
import { StaticCode } from '../entities/code/static-code';

export class AppCodeListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.appCodeGlob);
  }

  add(file: FileObject) {
    const code = new StaticCode(file, this.app.config.appCodeFolder, this.app.config);
    this.app.codes.items.push(code);
    this.app.pages.build();
    code.dist();
  }

  change(file: FileObject) {
    const code = this.app.codes.getCode(file);

    if (code) {
      code.updateContent();
      code.dist();
    } else {
      this.add(file);
    }
  }

  unlink(file: FileObject) {
    const code = this.app.codes.removeCode(file);

    if (code) {
      code.undist();
      this.app.pages.build();
    }
  }

}
