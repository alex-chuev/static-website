import * as path from 'path';
import * as _ from 'lodash';
import { State } from '../state';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import { dist } from '../utils/dist';
import { Language } from '../entities/language';

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

const footer = `
</urlset>
`;

export function renderSitemap(state: State) {
  const body = _.flatMap(state.pages, page =>
    state.languages.map(language => createItem(page, language, state))
  ).join('');

  dist('sitemap.xml', `${header}${body}${footer}`, state.options);
}

function createItem(page: string, language: Language, state: State): string {
  const url = createUrl(page, language, state);
  const alternate = createAlternates(page, language, state);

  return `
  <url>
    <loc>${url}</loc>${alternate}
  </url>`
}

function createAlternates(page: string, language: Language, state: State): string[] {
  return _.without(state.languages, language).map(alternateLanguage => createAlternate(page, alternateLanguage, state));
}

function createAlternate(page: string, language: Language, state: State): string {
  const url = createUrl(page, language, state);

  return `
    <xhtml:link rel="alternate" hreflang="${language.name}" href="${url}"/>`;
}

function createUrl(page: string, language: Language, state: State): string {
  return createAbsoluteUrl(path.join(language.url, `${page}.html`), state.options);
}
