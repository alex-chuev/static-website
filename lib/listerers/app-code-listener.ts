import { Listener } from './listener';
import * as minimatch from 'minimatch';

export abstract class AppCodeListener extends Listener {

  abstract property: string;
  abstract glob: string;

  test(absolutePath: string): boolean {
    return minimatch(absolutePath, this.glob);
  }

  add(absolutePath: string) {
    const code = this.app[this.property].addCode(absolutePath);
    code.dist();
    this.app.pages.build();
  }

  change(absolutePath: string) {
    const code = this.app[this.property].getCodeByAbsolutePath(absolutePath);

    if (code) {
      code.updateContent();
      code.dist();
    } else {
      this.add(absolutePath);
    }
  }

  unlink(absolutePath: string) {
    const code = this.app[this.property].removeCodeByAbsolutePath(absolutePath);

    if (code) {
      code.undist();
      this.app.pages.build();
    }
  }

}
