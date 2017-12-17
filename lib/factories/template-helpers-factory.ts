import * as _ from 'lodash';
import { TemplateHelpers } from '../interfaces/template-helpers';
import { Language } from '../entities/language';
import { Options } from '../interfaces/options';
import * as path from 'path';
import { PropertyPath } from 'lodash';
import { TranslationService } from '../services/translation-service';
import { copySync, existsSync } from 'fs-extra';
import { HtmlFactory } from './html-factory';
import { Attributes } from '../interfaces/attributes';
import { Url } from '../types';
import { Page } from '../entities/page';

export class TemplateHelpersFactory {
  static createTemplateHelpers(page: Page, options: Options): TemplateHelpers {
    const defaultLanguageUrl: Url = createAbsoluteUrl(`${page.data.id}.html`, options);
    const currentUrl = createAbsoluteUrl(path.join(page.data.language.url, `${page.data.id}.html`), options);

    function i18n(message: PropertyPath, otherwise = ''): string {
      if (_.has(page.data.language.translation, message)) {
        return _.get(page.data.language.translation, message);
      } else if (options.translations.generate) {
        _.set(page.data.language.translation, message, otherwise);

        TranslationService.saveTranslation(page.data.language, options);
      }

      return otherwise;
    }

    function url(relativeUrl: Url, languageName = page.data.language.name): string {
      return createAbsoluteUrl(path.join(Language.getUrl(languageName, options), relativeUrl), options);
    }

    function isActiveUrl(relativeUrl: Url): boolean {
      return defaultLanguageUrl === createAbsoluteUrl(relativeUrl, options);
    }

    function languageUrl(language: string): string {
      return createAbsoluteUrl(path.join(Language.getUrl(language, options), `${page.data.id}.html`), options);
    }

    function link(
      relativeUrl: Url, text?: string, className?: string, activeClass?: string, attrs?: Attributes, languageName = page.data.language.name): string {
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
      return link(createAbsoluteUrl(`${page.data.id}.html`, options), text, className, activeClassName, attributes, language);
    }

    function asset(file: string): string {
      const dir = path.dirname(page.data.id);
      const srcPath = path.join(options.src.folder, options.pages.folder, dir, file);
      const distPath = path.join(options.dist.folder, dir, file);

      if (existsSync(srcPath)) {
        if (false === existsSync(distPath)) {
          copySync(srcPath, distPath);
        }

        return createAbsoluteUrl(path.join(dir, file), options);
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

const indexRegExp = /index\.html$/g;
const slashRegExp = /\\/g;
const headSlashRegExp = /^\//g;

export function createAbsoluteUrl(relativeUrl: Url, options: Options): Url {
  return options.dist.url + relativeUrl
    .replace(indexRegExp, '')
    .replace(slashRegExp, '/')
    .replace(headSlashRegExp, '');
}
