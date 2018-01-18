import { Listener } from './listener';
import { Page } from '../entities/page';
import * as minimatch from 'minimatch';

export abstract class PagesCodeListener extends Listener {

  page: Page;

  abstract property: string;
  abstract glob: string;

  test(absolutePath: string): boolean {
    if (false === minimatch(absolutePath, this.glob)) {
      return false;
    }

    this.page = this.app.pages.getPageById(Page.createPageId(absolutePath));

    return Boolean(this.page);
  }

  add(absolutePath: string) {
    const code = this.page[this.property].addCode(absolutePath);
    code.dist();
    this.app.pages.buildPage(this.page);
  }

  change(absolutePath: string) {
    const code = this.page[this.property].getCodeByAbsolutePath(absolutePath);

    if (code) {
      code.updateContent();
      code.dist();
    } else {
      this.add(absolutePath);
    }
  }

  unlink(absolutePath: string) {
    const code = this.page[this.property].removeCodeByAbsolutePath(absolutePath);

    if (code) {
      code.undist();
      this.app.pages.buildPage(this.page);
    }
  }

}
