import * as path from 'path';
import * as _ from 'lodash';

import { Compiler } from '../compiler';
import { createAbsoluteUrl } from '../../utils/create-absolute-url';
import { Translation } from '../../interfaces/translation';

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const footer = `
</urlset>`;

interface Data {
  pages: string[];
  translations: Translation[];
}

export class SitemapCompiler extends Compiler {
  method(src: string, data: Data, file: string): string {
    const body = _(data.pages)
      .flatMap(page => data.translations.map(translation => (
        translation.language === this.options.translations.defaultLanguage ?
          path.join(page + '.html') :
          path.join(translation.language, page + '.html')
      )))
      .map(url => createAbsoluteUrl(url, this.options))
      .map(url => this.renderUrl(url))
      .join('');

    return `${header}${body}${footer}`;
  }

  private renderUrl(url: string): string {
    return `
  <url>
    <loc>${url}</loc>
  </url>`;
  }
}
