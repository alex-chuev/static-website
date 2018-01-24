import * as path from 'path';
import { AppConfigDefaults } from './app-config-defaults';
import { existsSync, readJsonSync } from 'fs-extra';

export class AppConfig extends AppConfigDefaults {

  constructor(public production = true, configPath = 'static-website.json') {
    super(existsSync(configPath) ? readJsonSync(configPath) : undefined);
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

  get pagesCodeGlob(): string {
    return path.join(this.pagesFolder, `**/*?(.inline).+(css|js)`);
  }

  get appCodeFolder(): string {
    return path.resolve(this.src.folder);
  }

  get appCodeGlob(): string {
    return path.join(this.appCodeFolder, `main?(.inline).+(css|js)`);
  }

}
