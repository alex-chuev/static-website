import * as path from 'path';

import { outputJsonSync } from 'fs-extra';
import { Language } from '../entities/language';
import { Config } from '../interfaces/config';

export class TranslationService {
  static saveTranslation(language: Language, options: Config) {
    const file = path.join(
      options.src.folder,
      options.translations.folder,
      language.name + '.' + options.translations.extension,
    );

    outputJsonSync(file, language.translation, {
      spaces: 2,
    })
  }
}
