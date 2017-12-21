import { copySync, emptyDirSync, outputFileSync, pathExistsSync } from 'fs-extra';
import * as path from 'path';
import { Language } from '../entities/language';
import { Page, PageData } from '../entities/page';
import { BuildCache } from '../cache';
import * as pug from 'pug';
import { generateSitemap } from './sitemap';
import { copyAssets } from './assets';

export function build(cache: BuildCache) {
  if (cache.config.dist.clean) {
    emptyDirSync(cache.config.dist.folder);
  }

  if (pathExistsSync(path.join(cache.config.src.folder, cache.config.assets.folder))) {
    copySync(path.join(cache.config.src.folder, cache.config.assets.folder), cache.config.dist.folder);
  }

  buildPages(cache.pages, cache.languages, cache);
  generateSitemap(cache);
  copyAssets(cache);
}

export function buildPages(pages: Page[], languages: Language[], cache: BuildCache) {
  pages.forEach(page => languages.forEach(language => buildPage(page, language, cache)))
}

export function buildPage(page: Page, language: Language, cache: BuildCache) {
  const config = cache.config;
  const data = new PageData(page, language, cache);
  const code = pug.render(page.content, {...data, filename: page.fullPath});

  outputFileSync(path.join(cache.config.dist.folder, language.url, page.distPathWithExt), code);
}
