import * as path from 'path';
import { AppConfigDefaults } from './app-config-defaults';
import { existsSync, readJsonSync } from 'fs-extra';

export class AppConfig extends AppConfigDefaults {
  constructor(filePath = 'static-website.json') {
    super(existsSync(filePath) ? readJsonSync(filePath) : undefined);
  }

  get assetsFolder(): string {
    return path.resolve(path.join(this.src.folder, this.assets.folder));
  }

  get assetsGlob(): string {
    return path.join(this.assetsFolder, `**/*`);
  }

  get translationsFolder(): string {
    return path.resolve(path.join(this.src.folder, this.translations.folder));
  }

  get translationsGlob(): string {
    return path.join(this.translationsFolder, `*.${this.translations.extension}`);
  }

  get pagesFolder(): string {
    return path.resolve(path.join(this.src.folder, this.pages.folder));
  }

  get pagesGlob(): string {
    return path.join(this.pagesFolder, `**/*.${this.pages.extension}`);
  }

  get layoutsGlob(): string {
    return path.join(this.srcFolder, 'layouts', `*.${this.pages.extension}`);
  }

  get srcFolder(): string {
    return path.resolve(this.src.folder);
  }

  get pagesStylesGlob(): string {
    return path.join(this.pagesFolder, `**/*?(.inline).${this.styles.extension}`);
  }

  get pagesScriptsGlob(): string {
    return path.join(this.pagesFolder, `**/*?(.inline).${this.scripts.extension}`);
  }

  get scriptsFolder(): string {
    return path.resolve(path.join(this.src.folder, this.scripts.folder));
  }

  get stylesGlob(): string {
    return path.join(this.stylesFolder, `**/*.${this.styles.extension}`);
  }

  get scriptsGlob(): string {
    return path.join(this.scriptsFolder, `**/*.${this.scripts.extension}`);
  }

  get scriptsBase(): string {
    return path.join(this.scriptsFolder, 'main');
  }

  get stylesFolder(): string {
    return path.resolve(path.join(this.src.folder, this.styles.folder));
  }

  get stylesBase(): string {
    return path.join(this.stylesFolder, 'main');
  }

}
