import * as _ from 'lodash';
import { Url } from '../types';
import { Config } from '../interfaces/config';
import { createAbsoluteUrl } from '../factories/template-helpers-factory';
import * as path from 'path';
import { Language } from '../entities/language';
import { PropertyPath } from 'lodash';
import { PageDataProps } from '../entities/page';
import { TranslationService } from '../services/translation-service';

export function assetHelper(relativeUrl: Url, options: Config): Url {
  return createAbsoluteUrl(relativeUrl, options);
}

export function urlHelper(relativeUrl: Url, languageName: string, options: Config): Url {
  return createAbsoluteUrl(path.join(Language.getUrl(languageName, options), relativeUrl), options);
}

export function i18nHelper(message: PropertyPath, otherwise = '', props: PageDataProps): string {
  if (_.has(props.language.translation, message)) {
    return _.get(props.language.translation, message);
  } else if (props.config.translations.generate) {
    _.set(props.language.translation, message, otherwise);

    TranslationService.saveTranslation(props.language, props.config);
  }

  return otherwise;
}
