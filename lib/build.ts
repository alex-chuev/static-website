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
import { Environment } from './interfaces/environment';

export function build(options: Options, environment: Environment) {
  if (options.dist.clean) {
    emptyDirSync(options.dist.folder);
  }

  const compilers = CompilersFactory.createCompilers(options);
  const css = renderStyles(compilers, options);
  const js = renderScripts(compilers, options);
  const pages = getPages(options);
  const languages = getLanguages(options);

  const state = new State({
    options,
    environment,
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
