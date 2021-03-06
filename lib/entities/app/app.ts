import { AppConfig } from './app-config';
import { emptyDirSync } from 'fs-extra';
import { AppAssets } from './app-assets';
import { AppLanguages } from './app-languages';
import { AppPages } from './app-pages';
import { AppSitemap } from './app-sitemap';
import { AppStaticCodes } from './app-static-codes';

export class App {

  assets = new AppAssets(this.config);
  languages = new AppLanguages(this.config);
  codes = new AppStaticCodes(this.config);
  pages = new AppPages(this.config, this.languages, this.codes);
  sitemap = new AppSitemap(this.config, this.pages, this.languages);

  constructor(public config = new AppConfig()) {
  }

  build() {
    if (this.config.dist.clean) {
      emptyDirSync(this.config.dist.folder);
    }

    this.assets.dist();
    this.codes.dist();
    this.pages.distCode();
    this.pages.build();
    this.sitemap.generate();
  }

}
