import * as path from 'path';
import { AppConfigDefaults } from './app-config-defaults';
import { existsSync, readJsonSync } from 'fs-extra';

export class AppConfig extends AppConfigDefaults {
  constructor(file = 'static-website.json') {
    super(existsSync(file) ? readJsonSync(file) : undefined);
  }

  get assetsFolder(): string {
    return path.join(this.src.folder, this.assets.folder);
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
}
