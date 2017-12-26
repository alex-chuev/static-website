import * as path from 'path';
import { ConfigDefaults } from './config-defaults';

export class Config extends ConfigDefaults {
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

  get stylesFolder(): string {
    return path.join(this.src.folder, this.styles.folder);
  }
}
