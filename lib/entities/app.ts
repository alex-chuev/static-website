import { AppConfig } from './app-config';
import { Environment } from '../interfaces/environment';
import { emptyDirSync } from 'fs-extra';
import { AppAssets } from './app-assets';
import { AppLanguages } from './app-languages';
import { AppPages } from './app-pages';
import { AppSitemap } from './app-sitemap';
import { CssCodes } from './css-codes';
import { JsCodes } from './js-codes';

export class App {
  assets = new AppAssets(this.config);
  languages = new AppLanguages(this.config);
  css = new CssCodes(this.config.stylesFolder, this.config.stylesBase, this.config, this.environment);
  js = new JsCodes(this.config.scriptsFolder, this.config.scriptsBase, this.config, this.environment);
  pages = new AppPages(
    this.config,
    this.environment,
    this.languages,
    this.css,
    this.js,
  );
  sitemap = new AppSitemap(this.config, this.pages, this.languages);

  constructor(public config: AppConfig, public environment: Environment) {
  }

  build() {
    this.prepareDist();

    this.assets.dist();
    this.css.dist();
    this.js.dist();
    this.pages.build();
    this.sitemap.generate();
  }

  private prepareDist() {
    if (this.config.dist.clean) {
      emptyDirSync(this.config.dist.folder);
    }
  }

}
