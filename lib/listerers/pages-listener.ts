import { Listener } from './listener';
import * as minimatch from 'minimatch';

export class PagesListener extends Listener {

  test(absolutePath: string): boolean {
    return minimatch(absolutePath, this.app.config.pagesGlob);
  }

  add(absolutePath: string) {
    const page = this.app.pages.addPage(absolutePath);
    page.distCode();
    this.app.pages.buildPage(page);
  }

  change(absolutePath: string) {
    const page = this.app.pages.getPageByAbsolutePath(absolutePath);

    if (page) {
      page.updateContent();
      this.app.pages.buildPage(page);
    } else {
      this.add(absolutePath);
    }
  }

  unlink(absolutePath: string) {
    const page = this.app.pages.removePages(absolutePath);

    if (page) {
      this.app.pages.undistPages(page);
    }
  }

}
