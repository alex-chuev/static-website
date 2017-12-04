import * as _ from 'lodash';
import { TemplateHelpers } from '../interfaces/template-helpers';
import { Translation } from '../interfaces/translation';
import { Options } from '../interfaces/options';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import * as path from 'path';
import { getLanguageUrlPart } from '../utils/get-language-url-part';
import { PropertyPath } from 'lodash';
import { TranslationService } from '../services/translation-service';

export class TemplateHelpersFactory {
  static createTemplateHelpers(page: string, translation: Translation, options: Options): TemplateHelpers {
    const pageWithoutIndex = removeIndex(page);

    return {
      currentUrl: createAbsoluteUrl(path.join(translation.languageUrlPart, removeIndex(`${page}.html`)), options),
      i18n(message: PropertyPath, otherwise = ''): string {
        if (_.has(translation, message)) {
          return _.get(translation, message);
        } else if (options.translations.generate) {
          TranslationService.saveTranslation(_.set(translation, message, otherwise), options);
        }

        return otherwise;
      },
      url(page: string, language = translation.language): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), removeIndex(page)), options);
      },
      isActiveUrl(page: string): boolean {
        return this.currentUrl === removeIndex(page);
      },
      languageUrl(language: string): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), pageWithoutIndex), options);
      },
      link(page: string): string {
        return '';
      },
      languageLink(page: string): string {
        return '';
      },
      asset(page: string): string {
        return '';
      },
    };
  }
}

function removeIndex(page: string): string {
  return page.replace(/(index|index.html)$/, '');
}
