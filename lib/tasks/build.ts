import { copySync, emptyDirSync, outputFileSync, pathExistsSync } from 'fs-extra';
import * as path from 'path';
import { Language } from '../entities/language';
import { Page, PageData } from '../entities/page';
import { App } from '../app';
import * as pug from 'pug';
import { generateSitemap } from './sitemap';
import { copyAssets } from './assets';

export function build(app: App) {
  if (app.config.dist.clean) {
    emptyDirSync(app.config.dist.folder);
  }

  if (pathExistsSync(path.join(app.config.src.folder, app.config.assets.folder))) {
    copySync(path.join(app.config.src.folder, app.config.assets.folder), app.config.dist.folder);
  }

  buildPages(app.pages, app.languages, app);
  generateSitemap(app);
  copyAssets(app);
}

export function buildPages(pages: Page[], languages: Language[], app: App) {
  pages.forEach(page => languages.forEach(language => buildPage(page, language, app)))
}

export function buildPage(page: Page, language: Language, app: App) {
  const data = new PageData(page, language, app);
  const code = pug.render(page.content, {...data, filename: page.fullPath});

  outputFileSync(path.join(app.config.dist.folder, language.url, page.distPathWithExt), code);
}
