import * as _ from 'lodash';

import { Translation } from '../interfaces/translation';
import { FilePath, Url } from '../types';
import { createUrl } from './create-url';
import { State } from '../state';

interface LinkOptions {
  class: string;
  activeClass: string;

  [option: string]: string;
}

interface LinkAttributes {
  href: string;
  class: string;

  [attributes: string]: string;
}

export function createLink(
  state: State,
  page: FilePath,
  translation: Translation,
  url: Url,
  content: string,
  linkOptions: LinkOptions,
  languageUrl = translation.languageUrlPart,
): string {
  const attributes: LinkAttributes = {
    href: createUrl(state, translation, url, languageUrl),
    class: getClass(linkOptions),
  };

  return `<a${_.reduce(attributes, (attrs, value, name) => attrs + ` ${name}="${value}"`, '')}>${content}</a>`;
}

function getClass(linkOptions: LinkOptions): string {
  return `${linkOptions.class}${isActive() ? ' ' + linkOptions.activeClass : ''}`;
}

function isActive(): boolean {
  return false;
}
