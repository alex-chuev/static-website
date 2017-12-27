import * as _ from 'lodash';
import * as path from 'path';
import * as sitemap from 'sitemap';
import { urlHelper } from '../helpers/template-helpers';
import { outputFileSync } from 'fs-extra';
import { AppConfig } from './app-config';
import { AppPages } from './app-pages';
import { AppLanguages } from './app-languages';

export class AppSitemap {

  file = path.join(this.config.dist.folder, 'sitemap.xml');

  constructor(private config: AppConfig, private pages: AppPages, private languages: AppLanguages) {
  }

  dist() {
    if (this.config.sitemap.generate) {
      outputFileSync(this.file, this.generateContent());
    }
  }

  private generateContent(): string {
    const hostname = this.config.sitemap.hostname;
    const urls = _.flatMap(this.pages.items, page => _.map(this.languages.items, language => {
      const url = urlHelper(page.distPathWithExt, language.name, this.config);
      const otherLanguages = _.filter(this.languages.items, item => item !== language);

      const links = otherLanguages.map(item => ({
        lang: item.name,
        url: urlHelper(page.distPathWithExt, item.name, this.config),
      }));

      return {
        url,
        links,
      };
    }));

    return sitemap.createSitemap({hostname, urls}).toString();
  }
}
