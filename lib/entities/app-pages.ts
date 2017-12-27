import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import * as glob from 'glob';
import { Page } from './page';
import { Environment } from '../interfaces/environment';
import { AppConfig } from './app-config';
import { Language } from './language';
import { AppLanguages } from './app-languages';
import { PageData } from './page-data';
import * as path from 'path';
import * as pug from 'pug';
import { distContent, unlinkDistFile } from '../helpers/dist-helpers';
import { CssCodes } from './css-codes';
import { JsCodes } from './js-codes';

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
      .map(file => new Page(file, this.config, this.environment))
      .forEach(page => this.items.push(page));
  }

  distCode() {
    this.items.forEach(page => page.distCode());
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
    const code = pug.render(page.content, {...data, filename: page.fullPath});

    distContent(code, this.getDistPath(page, language));
  }

  unlinkDistPages(pages: Page[], languages: Language[]) {
    pages.forEach(page => languages.forEach(language => this.unlinkDistPage(page, language)));
  }

  unlinkDistPage(page: Page, language: Language) {
    unlinkDistFile(this.getDistPath(page, language));
  }

  private getDistPath(page: Page, language: Language) {
    return path.join(this.config.dist.folder, language.url, page.distPathWithExt);
  }

  onWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
      case WatchAction.Unlink:
    }
  }

}
