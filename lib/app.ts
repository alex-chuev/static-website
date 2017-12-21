import { Config } from './interfaces/config';
import { Environment } from './interfaces/environment';
import { Language } from './entities/language';
import { Page, PageData } from './entities/page';
import { CssCode, JsCode, saveExternalCode, savePageExternalCode } from './tasks/code';
import { copySync, emptyDirSync, outputFileSync, pathExistsSync } from 'fs-extra';
import { copyAssets } from './tasks/assets';
import * as path from "path";
import { generateSitemap } from './tasks/sitemap';
import * as pug from "pug";
import { updateLanguages } from './tasks/languages';

class AppData {
  config: Config;
  environment: Environment;
  languages: Language[];
  inlineCss: CssCode;
  inlineJs: JsCode;
  externalCss: CssCode;
  externalJs: JsCode;
  pages: Page[];
  pageInlineCss: WeakMap<Page, CssCode>;
  pageInlineJs: WeakMap<Page, JsCode>;
  pageExternalCss: WeakMap<Page, CssCode>;
  pageExternalJs: WeakMap<Page, JsCode>;
}

export class App extends AppData {
  constructor(data: AppData) {
    super();

    Object.assign(this, data);
  }

  build() {
    if (this.config.dist.clean) {
      emptyDirSync(this.config.dist.folder);
    }

    if (pathExistsSync(path.join(this.config.src.folder, this.config.assets.folder))) {
      copySync(path.join(this.config.src.folder, this.config.assets.folder), this.config.dist.folder);
    }

    saveExternalCode(this);

    this.buildPages(this.pages, this.languages);

    generateSitemap(this);
    copyAssets(this);
    updateLanguages(this.languages);
  }

  buildPages(pages: Page[], languages: Language[]) {
    pages.forEach(page => languages.forEach(language => this.buildPage(page, language)))
  }

  buildPage(page: Page, language: Language) {
    const data = new PageData(page, language, this);
    const code = pug.render(page.content, {...data, filename: page.fullPath});

    savePageExternalCode(page, this);

    outputFileSync(path.join(this.config.dist.folder, language.url, page.distPathWithExt), code);
  }

}
