import * as glob from 'glob';
import { AppConfig } from './app-config';
import { Language } from '../language';
import { AppLanguages } from './app-languages';
import { PageData } from '../page-data';
import * as _ from 'lodash';
import { PageId } from '../../types';
import { Page } from '../code/page';
import { FileObject } from '../file-object';
import { StaticCodes } from '../code/static-codes';

export class AppPages {

  items: Page[] = [];

  constructor(
    private config: AppConfig,
    private languages: AppLanguages,
    private codes: StaticCodes,
  ) {
    AppPages.getPageFiles(this.config)
      .forEach(file => this.addPage(file));
  }

  static getPageFiles(config: AppConfig): FileObject[] {
    return glob.sync(config.pagesGlob)
      .map(filePath => new FileObject(filePath));
  }

  addPage(file: FileObject): Page {
    const page = new Page(file, this.config);
    this.items.push(page);
    return page;
  }

  getPage(file: FileObject): Page {
    return this.items.find(item => item.file.absolutePath === file.absolutePath);
  }

  getPageById(id: PageId): Page {
    return this.items.find(item => item.id === id);
  }

  removePage(file: FileObject): Page {
    return _.first(_.remove(this.items, item => item.file.absolutePath === file.absolutePath));
  }

  distCode(pages = this.items) {
    pages.forEach(page => page.distCode());
  }

  build(pages: Page[] = this.items, languages: Language[] = this.languages.items) {
    languages.forEach(language => {
      pages.forEach(page => {
        const data = new PageData(page, language, this.config, this.languages, this.codes);

        page.build(data, language);

        language.saveUpdated();
      });
    });
  }

  buildLanguage(language: Language) {
    this.build(this.items, [language]);
  }

  buildPage(page: Page) {
    this.build([page], this.languages.items);
  }

  undist(pages: Page[], languages: Language[]) {
    languages.forEach(language => {
      pages.forEach(page => {
        page.undistLanguage(language);
      });
    });
  }

  undistPage(page: Page) {
    this.undist([page], this.languages.items);
  }

  undistLanguage(language: Language) {
    this.undist(this.items, [language]);
  }

}
