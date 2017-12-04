import * as path from 'path';

import { outputJsonSync } from 'fs-extra';
import { Translation } from '../interfaces/translation';
import { Options } from '../interfaces/options';

export class TranslationService {
  static saveTranslation(translation: Translation, options: Options) {
    const file = path.join(
      options.src.folder,
      options.translations.folder,
      translation.language + '.' + options.translations.extension,
    );

    outputJsonSync(file, translation, {
      spaces: 2,
    })
  }
}
