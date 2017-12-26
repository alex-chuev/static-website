import { Config } from './interfaces/config';
import { Environment } from './interfaces/environment';
import { Language } from './entities/language';
import { Page, PageData } from './entities/page';
import { CssCode, JsCode, saveExternalCss, saveExternalJs, savePageExternalCode } from './tasks/code';
import { copySync, emptyDirSync, outputFileSync, pathExistsSync } from 'fs-extra';
import { copyAssets } from './tasks/assets';
import * as path from 'path';
import { generateSitemap } from './tasks/sitemap';
import * as pug from 'pug';
import { updateLanguages } from './tasks/languages';
import { WatchEvent } from './interfaces/watch-event';
import isInside from 'is-inside';
import { WatchAction } from './enums/watch-action';

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

    saveExternalCss(this);
    saveExternalJs(this);

    this.buildPages();

    copyAssets(this);
  }

  buildPages(pages = this.pages, languages = this.languages) {
    pages.forEach(page => languages.forEach(language => this.buildPage(page, language)));

    updateLanguages(this.languages);

    if (this.config.sitemap.generate) {
      generateSitemap(this);
    }
  }

  buildPage(page: Page, language: Language) {
    const data = new PageData(page, language, this);
    const code = pug.render(page.content, {...data, filename: page.fullPath});

    savePageExternalCode(page, this);

    outputFileSync(path.join(this.config.dist.folder, language.url, page.distPathWithExt), code);
  }

  onWatchEvent(event: WatchEvent) {
    if (isInside(event.file, this.assetsFolder)) {
      this.onAssetsEvent(event);
    } else if (isInside(event.file, this.translationsFolder)) {
      this.onTranslationsEvent(event);
    } else if (isInside(event.file, this.pagesFolder)) {
      this.onPagesEvent(event);
    } else if (isInside(event.file, this.scriptsFolder)) {
      this.onScriptsEvent(event);
    } else if (isInside(event.file, this.stylesFolder)) {
      this.onStylesEvent(event);
    } else {
      this.buildPages();
    }
  }

  onAssetsEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
    }
  }

  onTranslationsEvent(event: WatchEvent) {
  }

  onPagesEvent(event: WatchEvent) {
  }

  onScriptsEvent(event: WatchEvent) {
  }

  onStylesEvent(event: WatchEvent) {
  }


  get assetsFolder(): string {
    return path.join(this.config.src.folder, this.config.assets.folder);
  }

  get translationsFolder(): string {
    return path.join(this.config.src.folder, this.config.translations.folder);
  }

  get pagesFolder(): string {
    return path.join(this.config.src.folder, this.config.pages.folder);
  }

  get scriptsFolder(): string {
    return path.join(this.config.src.folder, this.config.scripts.folder);
  }

  get stylesFolder(): string {
    return path.join(this.config.src.folder, this.config.styles.folder);
  }

}
