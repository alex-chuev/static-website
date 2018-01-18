import { Listener } from './listener';
import * as minimatch from 'minimatch';

export class LayoutsListener extends Listener {

  test(absolutePath: string): boolean {
    return minimatch(absolutePath, this.app.config.layoutsGlob);
  }

  add(absolutePath: string) {
    this.app.pages.build();
  }

  change(absolutePath: string) {
    this.app.pages.build();
  }

  unlink(absolutePath: string) {
    this.app.pages.build();
  }

}
