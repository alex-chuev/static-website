import * as _ from 'lodash';
import * as path from 'path';
import * as sitemap from 'sitemap';
import { App } from '../app';
import { urlHelper } from '../helpers/template-helpers';
import { outputFileSync } from 'fs-extra';
import { Language } from '../entities/language';
import { Page } from '../entities/page';
import { Config } from '../entities/config';

export function generateSitemap(app: App) {
  const config = app.config;
  const content = generateSitemapContent(config, app.pages, app.languages);
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
