import * as _ from 'lodash';
import * as path from 'path';
import * as sitemap from 'sitemap';
import { DistHelpers } from '../../helpers/dist-helpers';
import { AppConfig } from './app-config';
import { AppPages } from './app-pages';
import { AppLanguages } from './app-languages';

export class AppSitemap {

  distPath = path.join(this.config.dist.folder, 'sitemap.xml');

  constructor(private config: AppConfig, private pages: AppPages, private languages: AppLanguages) {
  }

  generate() {
    try {
      DistHelpers.content(this.generateContent(), this.distPath);
    } catch (error) {
      console.log('Could not create sitemap due to an error:', error.message);
    }
  }

  private generateContent(): string {
    const hostname = this.config.sitemap.hostname;
    const urls = _.flatMap(this.pages.items, page => _.map(this.languages.items, language => {
      const url = page.createLanguageUrl(language);
      const otherLanguages = _.filter(this.languages.items, item => item !== language);

      const links = otherLanguages.map(anotherLanguage => ({
        lang: anotherLanguage.name,
        url: page.createLanguageUrl(anotherLanguage),
      }));

      return {
        url,
        links,
      };
    }));

    return sitemap.createSitemap({hostname, urls}).toString();
  }
}
