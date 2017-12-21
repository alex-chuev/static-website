import { getLanguages } from '../../tasks/languages';
import { getConfig } from '../../tasks/config';
import { updateTranslations } from '../../tasks/translations';

export function i18nCommand(message: string, value?: string) {
  const config = getConfig();
  const languages = getLanguages(config);

  languages.forEach(language => language.translate(message, value));

  updateTranslations(languages);
}
