import { Url } from '../types';
import { Config } from '../interfaces/config';
import { createAbsoluteUrl } from './url-helpers';
import * as path from 'path';
import { Language } from '../entities/language';

export function assetHelper(relativeUrl: Url, config: Config): Url {
  return createAbsoluteUrl(relativeUrl, config);
}

export function urlHelper(relativeUrl: Url, languageName: string, config: Config): Url {
  return createAbsoluteUrl(path.join(Language.getUrl(languageName, config), relativeUrl), config);
}
