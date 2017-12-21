import { Language } from '../entities/language';
import { sortObject } from '../helpers/object-helpers';
import { outputJsonSync } from 'fs-extra';

export function updateTranslations(languages: Language[]) {
  languages
    .filter(language => language.updated)
    .forEach(language => outputJsonSync(language.file, sortObject(language.translation), {spaces: 2}));
}
