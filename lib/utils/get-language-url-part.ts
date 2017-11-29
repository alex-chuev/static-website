import { Options } from '../interfaces/options';

export function getLanguageUrlPart(language: string, options: Options): string {
  return language === options.translations.defaultLanguage ? '' : language;
}
