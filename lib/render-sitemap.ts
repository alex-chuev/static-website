import { Options } from './interfaces/options';
import { createAbsoluteUrl } from './utils/create-absolute-url';
import { dist } from './utils/dist';

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const footer = `
</urlset>`;

export function renderSitemap(pages: string[], options: Options) {
  const body = pages.reduce((xml, page) => xml + renderUrl(createAbsoluteUrl(page, options)), '');

  dist('sitemap.xml', `${header}${body}${footer}`, options);
}

function renderUrl(url: string): string {
  return `
  <url>
    <loc>${url}</loc>
  </url>`;
}
