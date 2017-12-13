import { Translation } from '../interfaces/translation';
import { Url } from '../types';
import { getLanguageUrlPart } from '../utils/get-language-url-part';
import { Options } from '../interfaces/options';
import * as File from 'vinyl';

export class Language {
  name: string;
  url: Url;
  translation: Translation;

  constructor(file: File, options: Options) {
    this.name = file.basename;
    this.url = getLanguageUrlPart(this.name, options);
    this.translation = JSON.parse(file.contents.toString());
  }
}
