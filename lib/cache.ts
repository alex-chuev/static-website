import { Config } from './interfaces/config';
import { Environment } from './interfaces/environment';
import { Language } from './entities/language';
import { Page } from './entities/page';
import { CssCode, JsCode } from './tasks/code';

class BuildCacheData {
  config: Config;
  environment: Environment;
  languages: Language[];
  globalInlineCss: CssCode;
  globalInlineJs: JsCode;
  globalExternalCss: CssCode;
  globalExternalJs: JsCode;
  pages: Page[];
  pageInlineCss: WeakMap<Page, CssCode>;
  pageInlineJs: WeakMap<Page, JsCode>;
  pageExternalCss: WeakMap<Page, CssCode>;
  pageExternalJs: WeakMap<Page, JsCode>;
}

export class BuildCache extends BuildCacheData {
  constructor(data: BuildCacheData) {
    super();

    Object.assign(this, data);
  }
}
