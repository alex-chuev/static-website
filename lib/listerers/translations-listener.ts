import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';

export class TranslationsListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.translationsGlob);
  }

  add(file: FileObject) {
    this.app.pages.buildLanguage(this.app.languages.addLanguage(file));
  }

  change(file: FileObject) {
    const language = this.app.languages.getLanguage(file);

    if (language) {
      this.app.pages.buildLanguage(language);
    } else {
      this.add(file);
    }
  }

  unlink(file: FileObject) {
    const language = this.app.languages.removeLanguage(file);

    if (language) {
      this.app.pages.undistLanguage(language);
    }
  }

}
