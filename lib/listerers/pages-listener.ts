import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';

export class PagesListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.pagesGlob);
  }

  add(file: FileObject) {
    const page = this.app.pages.addPage(file);
    page.distCode();
    this.app.pages.buildPage(page);
  }

  change(file: FileObject) {
    const page = this.app.pages.getPage(file);

    if (page) {
      page.updateContent();
      this.app.pages.buildPage(page);
    } else {
      this.add(file);
    }
  }

  unlink(file: FileObject) {
    const page = this.app.pages.removePage(file);

    if (page) {
      this.app.pages.undistPage(page);
    }
  }

}
