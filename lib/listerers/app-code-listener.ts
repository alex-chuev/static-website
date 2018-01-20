import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';
import { StaticCodesFactory } from '../factories/static-codes-factory';

export abstract class AppCodeListener extends Listener {

  abstract root: string;
  abstract glob: string;

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.glob);
  }

  add(file: FileObject) {
    const code = StaticCodesFactory.createSingle(file, this.root, this.app.config);
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
