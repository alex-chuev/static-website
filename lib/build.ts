import * as fs from 'fs-extra';

import { Options } from './interfaces/options';
import { renderPages } from './render/render-pages';
import { renderSitemap } from './render/render-sitemap';
import { getPages } from './utils/get-pages';
import { getTranslations } from './utils/get-translations';
import { CompilersFactory } from './factories/compilers-factory';
import { renderScripts } from './render/render-scripts';
import { renderStyles } from './render/render-styles';
import { State } from './state';
import { copyAssets } from './utils/copy-assets';

export function build(options: Options) {
  if (options.dist.clean) {
    fs.removeSync(options.dist.folder);
  }

  const pages = getPages(options);
  const translations = getTranslations(options);
  const compilers = CompilersFactory.createCompilers(options);
  const css = renderStyles(compilers, options);
  const js = renderScripts(compilers, options);

  const state = new State({
    options,
    pages,
    translations,
    compilers,
    css,
    js,
  });

  copyAssets(state);
  renderPages(state);

  if (options.sitemap.generate) {
    renderSitemap(state);
  }
}
