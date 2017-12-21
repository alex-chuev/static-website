import * as _ from 'lodash';
import * as path from 'path';
import * as sitemap from 'sitemap';
import { BuildCache } from '../cache';
import { urlHelper } from '../helpers/template-helpers';
import { outputFileSync } from 'fs-extra';
import { Language } from '../entities/language';
import { Page } from '../entities/page';
import { Config } from '../interfaces/config';

export function generateSitemap(cache: BuildCache) {
  const config = cache.config;
  const content = generateSitemapContent(config, cache.pages, cache.languages);
  const dist = path.join(config.dist.folder, 'sitemap.xml');

  outputFileSync(dist, content);
}

function generateSitemapContent(config: Config, pages: Page[], languages: Language[]): string {
  return sitemap.createSitemap({
    hostname: config.sitemap.domain,
    urls: _.flatMap(pages, page => _.map(languages, language => {
      const url = urlHelper(page.distPathWithExt, language.name, config);
      const links = languages
        .filter(item => language !== item)
        .map(item => {
          return {
            lang: item.name,
            url: urlHelper(page.distPathWithExt, item.name, config),
          };
        });

      return {
        url,
        links,
      }
    })),
  });
}
