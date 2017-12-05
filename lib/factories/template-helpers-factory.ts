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
import { Url } from '../types';
import { ConsoleService } from '../services/console-service';

export class TemplateHelpersFactory {
  static createTemplateHelpers(currentPage: string, language: Language, options: Options): TemplateHelpers {
    const defaultLanguageUrl: Url = createAbsoluteUrl(`${currentPage}.html`, options);

    return {
      currentUrl: createAbsoluteUrl(path.join(language.url, `${currentPage}.html`), options),
      i18n(message: PropertyPath, otherwise = ''): string {
        if (_.has(language.translation, message)) {
          return _.get(language.translation, message);
        } else if (options.translations.generate) {
          TranslationService.saveTranslation(_.set(language.translation, message, otherwise), options);
        }

        return otherwise;
      },
      url(relativeUrl: Url, languageName = language.name): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(languageName, options), relativeUrl), options);
      },
      isActiveUrl(relativeUrl: Url): boolean {
        return defaultLanguageUrl === createAbsoluteUrl(relativeUrl, options);
      },
      languageUrl(language: string): string {
        return createAbsoluteUrl(path.join(getLanguageUrlPart(language, options), `${currentPage}.html`), options);
      },
      link(url: Url, text?: string, className?: string, activeClass?: string, attrs?: Attributes, languageName = language.name): string {
        const href = this.url(url, languageName);
        const attributes: Attributes = {href, hreflang: languageName};

        if (activeClass && this.isActiveUrl(url)) {
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
      },
    };
  }
}
