import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { getLanguageUrlPart } from '../utils/get-language-url-part';
import { Options } from '../interfaces/options';

export class Language {
  url: Url;

  constructor(
    public name: string,
    public translation: Translation,
    options: Options,
  ) {
    this.url = getLanguageUrlPart(name, options);
  }
}
