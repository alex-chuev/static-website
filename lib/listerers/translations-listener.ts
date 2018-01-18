import { Listener } from './listener';
import * as minimatch from 'minimatch';

export class TranslationsListener extends Listener {

  test(absolutePath: string): boolean {
    return minimatch(absolutePath, this.app.config.translationsGlob);
  }

  add(absolutePath: string) {
    this.app.pages.buildLanguage(this.app.languages.addLanguage(absolutePath));
  }

  change(absolutePath: string) {
    const language = this.app.languages.updateLanguage(absolutePath);

    if (language) {
      this.app.pages.buildLanguage(language);
    } else {
      this.add(absolutePath);
    }
  }

  unlink(absolutePath: string) {
    this.app.pages.undistPages(this.app.pages.items, this.app.languages.removeLanguages(absolutePath));
  }

}
