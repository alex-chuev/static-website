import * as _ from 'lodash';
import { TemplateHelpers } from '../interfaces/template-helpers';
import { Translation } from '../interfaces/translation';
import { Options } from '../interfaces/options';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import * as path from 'path';
import { getLanguageUrlPart } from '../utils/get-language-url-part';
import { PropertyPath } from 'lodash';
import { TranslationService } from '../services/translation-service';
import { copySync, existsSync } from 'fs-extra';
import { HtmlFactory } from './html-factory';
import { Attributes } from '../interfaces/attributes';

export class TemplateHelpersFactory {
  static createTemplateHelpers(currentPage: string, translation: Translation, options: Options): TemplateHelpers {
    const pageWithoutIndex = removeIndex(currentPage);
    const urlWithoutLanguage = createAbsoluteUrl(removeIndex(`${currentPage}.html`), options);

    return {
      currentUrl: createAbsoluteUrl(
        path.join(translation.languageUrlPart, removeIndex(`${currentPage}.html`)), options),
      i18n(message: PropertyPath, otherwise = ''): string {
        if (_.has(translation, message)) {
          return _.get(translation, message);
        } else if (options.translations.generate) {
          TranslationService.saveTranslation(_.set(translation, message, otherwise), options);
        }

        return otherwise;
      },
      url(relativeUrl: string, language = translation.language): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), removeIndex(relativeUrl)), options);
      },
      isActiveUrl(relativeUrl: string): boolean {
        return urlWithoutLanguage === removeIndex(relativeUrl);
      },
      languageUrl(language: string): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), pageWithoutIndex), options);
      },
      link(page: string, text?: string, className?: string, activeClass?: string, attrs?: Attributes, language?: string): string {
        const href = this.url(page, language);
        const attributes: Attributes = {href};

        if (activeClass && this.isActiveUrl(page)) {
          className += ` ${activeClass}`;
        }

        if (className) {
          attributes['class'] = className;
        }

        _.forEach(attrs, (value, name) => attributes[name] = value);

        return HtmlFactory.createElement('a', text ? text : href, attributes);
      },
      languageLink(language: string, text?: string, className?: string, activeClassName?: string, attributes?: Attributes): string {
        return this.link(createAbsoluteUrl(`${currentPage}.html`, options), text, className, activeClassName, attributes, language);
      },
      asset(file: string): string {
        const dir = path.parse(currentPage).dir;
        const srcPath = path.join(options.src.folder, options.pages.folder, dir, file);
        const distPath = path.join(options.dist.folder, dir, file);

        if (existsSync(srcPath)) {
          if (false === existsSync(distPath)) {
            copySync(srcPath, distPath);

            if (options.verbose) {
              console.info(`> ${path.relative(options.dist.folder, distPath)}`);
            }
          }

          return createAbsoluteUrl(path.join(dir, file), options);
        } else {
          throw new Error(`File ${file} doesn't exist.`);
        }
      },
    };
  }
}

function removeIndex(page: string): string {
  return page.replace(/(index|index.html)$/, '');
}
