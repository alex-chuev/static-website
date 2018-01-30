import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';
import { Page } from '../entities/code/page';
import { StaticCode } from '../entities/code/static-code';

export class PagesCodeListener extends Listener {

  page: Page;

  test(file: FileObject): boolean {
    if (false === minimatch(file.absolutePath, this.app.config.pagesCodeGlob)) {
      return false;
    }

    this.page = this.app.pages.getPageById(Page.createPageId(file));

    return Boolean(this.page);
  }

  add(file: FileObject) {
    const code = new StaticCode(file, this.app.config.pagesFolder, this.app.config);
    code.dist();
    this.page.codes.items.push(code);
    this.app.pages.buildPage(this.page);
  }

  change(file: FileObject) {
    const code = this.page.codes.getCode(file);

    if (code) {
      code.updateAndDistIfChanged();
    } else {
      this.add(file);
    }
  }

  unlink(file: FileObject) {
    const code = this.page.codes.removeCode(file);

    if (code) {
      code.undist();
      this.app.pages.buildPage(this.page);
    }
  }

}
