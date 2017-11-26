import { Url } from '../types';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import * as path from 'path';
import { Translation } from '../interfaces/translation';
import { State } from '../state';

export function createUrl(
  state: State,
  translation: Translation,
  url: Url,
  languageUrl = translation.languageUrlPart,
): string {
  return createAbsoluteUrl(path.join(languageUrl, url), state.options);
}
