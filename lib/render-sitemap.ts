import { Options } from './interfaces/options';

import { SitemapCompiler } from './compilers/sitemap/sitemap-compiler';
import { Translation } from './interfaces/translation';

export function renderSitemap(pages: string[], translations: Translation[], options: Options) {
  const compiler = new SitemapCompiler(options);
  compiler.compileToFile(null, {
    pages,
    translations,
  }, 'sitemap.xml');
}
