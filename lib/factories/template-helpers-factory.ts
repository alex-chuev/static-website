import * as _ from 'lodash';
import { TemplateHelpers } from '../interfaces/template-helpers';
import { Language } from '../entities/language';
import { Options } from '../interfaces/options';
import { createAbsoluteUrl } from '../utils/create-absolute-url';
import * as path from 'path';
import { getLanguageUrlPart } from '../utils/get-language-url-part';
import { PropertyPath } from 'lodash';
import { TranslationService } from '../services/translation-service';
import { copySync, existsSync } from 'fs-extra';
import { HtmlFactory } from './html-factory';
import { Attributes } from '../interfaces/attributes';
import { PageId, Url } from '../types';
import { ConsoleService } from '../services/console-service';

export class TemplateHelpersFactory {
  static createTemplateHelpers(currentPage: PageId, language: Language, options: Options): TemplateHelpers {
    const defaultLanguageUrl: Url = createAbsoluteUrl(`${currentPage}.html`, options);
    const currentUrl = createAbsoluteUrl(path.join(language.url, `${currentPage}.html`), options);

    function i18n(message: PropertyPath, otherwise = ''): string {
      if (_.has(language.translation, message)) {
        return _.get(language.translation, message);
      } else if (options.translations.generate) {
        _.set(language.translation, message, otherwise);

        TranslationService.saveTranslation(language, options);
      }

      return otherwise;
    }

    function url(relativeUrl: Url, languageName = language.name): string {
      return createAbsoluteUrl(path.join(getLanguageUrlPart(languageName, options), relativeUrl), options);
    }

    function isActiveUrl(relativeUrl: Url): boolean {
      return defaultLanguageUrl === createAbsoluteUrl(relativeUrl, options);
    }

    function languageUrl(language: string): string {
      return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), `${currentPage}.html`), options);
    }

    function link(
      relativeUrl: Url, text?: string, className?: string, activeClass?: string, attrs?: Attributes, languageName = language.name): string {
      const href = url(relativeUrl, languageName);
      const attributes: Attributes = {href, hreflang: languageName};

      if (activeClass && isActiveUrl(relativeUrl)) {
        className += ` ${activeClass}`;
      }

      if (className) {
        attributes['class'] = className;
      }

      _.forEach(attrs, (value, name) => attributes[name] = value);

      return HtmlFactory.createElement('a', text ? text : href, attributes);
    }

    function languageLink(language: string, text?: string, className?: string, activeClassName?: string, attributes?: Attributes): string {
      return link(createAbsoluteUrl(`${currentPage}.html`, options), text, className, activeClassName, attributes, language);
    }

    function asset(file: string): string {
      const dir = path.dirname(currentPage);
      const srcPath = path.join(options.src.folder, options.pages.folder, dir, file);
      const distPath = path.join(options.dist.folder, dir, file);

      if (existsSync(srcPath)) {
        if (false === existsSync(distPath)) {
          copySync(srcPath, distPath);

          if (options.verbose) {
            ConsoleService.dist(distPath, options);
          }
        }

        return createAbsoluteUrl(path.join(dir, file), options);
      } else {
        ConsoleService.error(`File ${srcPath} doesn't exist.`, options);
      }
    }

    return {
      currentUrl,
      i18n,
      url,
      isActiveUrl,
      languageUrl,
      link,
      languageLink,
      asset,
    };
  }
}
