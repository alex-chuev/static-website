import { Config } from './interfaces/config';
import { Environment } from './interfaces/environment';
import { Language } from './entities/language';
import { Page } from './entities/page';

class BuildCacheData {
  config: Config;
  environment: Environment;
  languages: Language[];
  globalInlineCss: string;
  globalInlineJs: string;
  globalExternalCss: string;
  globalExternalJs: string;
  pages: Page[];
  pageInlineCss: WeakMap<Page, string>;
  pageInlineJs: WeakMap<Page, string>;
  pageExternalCss: WeakMap<Page, string>;
  pageExternalJs: WeakMap<Page, string>;
}

export class BuildCache extends BuildCacheData {
  constructor(data: BuildCacheData) {
    super();

    Object.assign(this, data);
  }
}
