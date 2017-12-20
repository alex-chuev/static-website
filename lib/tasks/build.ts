import { Environment } from '../interfaces/environment';
import { Config } from '../interfaces/config';
import { copySync, emptyDirSync, outputFileSync, pathExistsSync } from 'fs-extra';
import { createBuildCache } from './cache';
import * as path from 'path';
import { Language } from '../entities/language';
import { Page, PageData } from '../entities/page';
import { BuildCache } from '../cache';
import * as pug from 'pug';

export async function build(config: Config, environment: Environment): Promise<void> {
  const cache = createBuildCache(config, environment);

  if (config.dist.clean) {
    emptyDirSync(config.dist.folder);
  }

  if (pathExistsSync(path.join(config.src.folder, config.assets.folder))) {
    copySync(path.join(config.src.folder, config.assets.folder), config.dist.folder);
  }

  buildPages(cache.pages, cache.languages, cache);
}

export function buildPages(pages: Page[], languages: Language[], cache: BuildCache) {
  pages.forEach(page => languages.forEach(language => buildPage(page, language, cache)))
}

export function buildPage(page: Page, language: Language, cache: BuildCache) {
  const config = cache.config;
  const data = new PageData(page, language, cache);
  const code = pug.render(page.content, {...data, filename: page.file});
  const file = path.relative(path.join(config.src.folder, config.pages.folder), page.id);

  outputFileSync(path.join(config.dist.folder, language.url, `${file}.html`), code);
}
