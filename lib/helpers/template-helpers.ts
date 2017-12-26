import { Url } from '../types';
import { AppConfig } from '../entities/app-config';
import { createAbsoluteUrl } from './url-helpers';
import * as path from 'path';
import { Language } from '../entities/language';

export function assetHelper(relativeUrl: Url, config: AppConfig): Url {
  return createAbsoluteUrl(relativeUrl, config);
}

export function urlHelper(relativeUrl: Url, languageName: string, config: AppConfig): Url {
  return createAbsoluteUrl(path.join(Language.getUrl(languageName, config), relativeUrl), config);
}
