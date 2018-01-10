import * as path from 'path';
import { AppConfigDefaults } from './app-config-defaults';
import { existsSync, readJsonSync } from 'fs-extra';

export class AppConfig extends AppConfigDefaults {
  constructor(filePath = 'static-website.json') {
    super(existsSync(filePath) ? readJsonSync(filePath) : undefined);
  }

  get assetsFolder(): string {
    return path.join(this.src.folder, this.assets.folder);
  }

  get assetsGlob(): string {
    return path.join(this.assetsFolder, `**/*`);
  }

  get translationsFolder(): string {
    return path.join(this.src.folder, this.translations.folder);
  }

  get translationsGlob(): string {
    return path.join(this.translationsFolder, `*.${this.translations.extension}`);
  }

  get pagesFolder(): string {
    return path.join(this.src.folder, this.pages.folder);
  }

  get pagesGlob(): string {
    return path.join(this.pagesFolder, `**/*.${this.pages.extension}`);
  }

  get scriptsFolder(): string {
    return path.join(this.src.folder, this.scripts.folder);
  }

  get scriptsBase(): string {
    return path.join(this.scriptsFolder, 'main');
  }

  get stylesFolder(): string {
    return path.join(this.src.folder, this.styles.folder);
  }

  get stylesBase(): string {
    return path.join(this.stylesFolder, 'main');
  }

  isTranslationFile(absolutePath: string): boolean {
    return path.extname(absolutePath) !== `.${this.translations.extension}`;
  }

  isStyleFile(absolutePath: string): boolean {
    return path.extname(absolutePath) !== `.${this.styles.extension}`;
  }

  isScriptFile(absolutePath: string): boolean {
    return path.extname(absolutePath) !== `.${this.scripts.extension}`;
  }

  isPageFile(absolutePath: string): boolean {
    return path.extname(absolutePath) !== `.${this.scripts.extension}`;
  }
}
