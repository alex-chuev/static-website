import * as glob from 'glob';
import { Page } from './page';
import { Environment } from '../interfaces/environment';
import { AppConfig } from './app-config';
import { Language } from './language';
import { AppLanguages } from './app-languages';
import { PageData } from './page-data';
import * as path from 'path';
import * as pug from 'pug';
import { distContent, undistFile } from '../helpers/dist-helpers';
import { CssCodes } from './css-codes';
import { JsCodes } from './js-codes';
import * as _ from 'lodash';
import { PageId } from '../types';

export class AppPages {

  items: Page[] = [];

  constructor(
    private config: AppConfig,
    private environment: Environment,
    private languages: AppLanguages,
    private css: CssCodes,
    private js: JsCodes,
  ) {
    glob.sync(this.config.pagesGlob)
      .forEach(file => this.addPage(path.resolve(file)));
  }

  addPage(absolutePath: string): Page {
    const page = new Page(absolutePath, this.config, this.environment);
    this.items.push(page);
    return page;
  }

  getPage(absolutePath: string): Page {
    return this.items.find(item => item.absolutePath === absolutePath);
  }

  getPageById(id: PageId): Page {
    return this.items.find(item => item.id === id);
  }

  removePages(absolutePath: string): Page[] {
    return _.remove(this.items, item => item.absolutePath === absolutePath);
  }

  distCode(pages = this.items) {
    pages.forEach(page => page.distCode());
  }

  build(pages: Page[] = this.items, languages: Language[] = this.languages.items) {
    pages.forEach(page => languages.forEach(language => this.buildPage(page, language)));

    this.languages.save();
  }

  buildPage(page: Page, language: Language) {
    const data = new PageData(
      page,
      language,
      this.config,
      this.environment,
      this.languages,
      this.css,
      this.js,
    );
    const code = pug.render(page.content, {...data, filename: page.absolutePath});

    distContent(code, this.getDistPath(page, language));
  }

  undistPages(pages: Page[], languages: Language[] = this.languages.items) {
    pages.forEach(page => languages.forEach(language => this.undistPage(page, language)));
  }

  undistPage(page: Page, language: Language) {
    undistFile(this.getDistPath(page, language));
  }

  private getDistPath(page: Page, language: Language) {
    return path.join(this.config.dist.folder, language.url, page.relativeDistPath);
  }
}
