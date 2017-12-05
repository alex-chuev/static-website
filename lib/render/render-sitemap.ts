import * as path from 'path';
import * as _ from 'lodash';
import { State } from '../state';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { dist } from '../utils/dist';

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const footer = `
</urlset>`;

export function renderSitemap(state: State) {
  const body = _(state.pages)
    .flatMap(page => state.translations.map(translation => (
      path.join(translation.languageUrlPart, `${page}.html`)
    )))
    .map(url => createAbsoluteUrl(url, state.options))
    .map(url => `
  <url>
    <loc>${url}</loc>
  </url>`)
    .join('');

  dist('sitemap.xml', `${header}${body}${footer}`, state.options);
}
