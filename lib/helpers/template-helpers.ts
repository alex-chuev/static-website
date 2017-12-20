import { Url } from '../types';
import { Config } from '../interfaces/config';
import { createAbsoluteUrl } from './url-helpers';
import * as path from 'path';
import { Language } from '../entities/language';

export function assetHelper(relativeUrl: Url, options: Config): Url {
  return createAbsoluteUrl(relativeUrl, options);
}

export function urlHelper(relativeUrl: Url, languageName: string, options: Config): Url {
  return createAbsoluteUrl(path.join(Language.getUrl(languageName, options), relativeUrl), options);
}
