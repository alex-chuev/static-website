import { emptyDirSync } from 'fs-extra';

import { Options } from './interfaces/options';
import { renderPages } from './render/render-pages';
import { renderSitemap } from './render/render-sitemap';
import { getPages } from './utils/get-pages';
import { getLanguages } from './utils/get-languages';
import { CompilersFactory } from './factories/compilers-factory';
import { renderScripts } from './render/render-scripts';
import { renderStyles } from './render/render-styles';
import { State } from './state';
import { copyAssets } from './utils/copy-assets';

export function build(options: Options) {
  if (options.dist.clean) {
    emptyDirSync(options.dist.folder);
  }

  const pages = getPages(options);
  const languages = getLanguages(options);
  const compilers = CompilersFactory.createCompilers(options);
  const css = renderStyles(compilers, options);
  const js = renderScripts(compilers, options);

  const state = new State({
    options,
    pages,
    languages,
    compilers,
    css,
    js,
  });

  copyAssets(options);
  renderPages(state);

  if (options.sitemap.generate) {
    renderSitemap(state);
  }
}
