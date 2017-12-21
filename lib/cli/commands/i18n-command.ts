import { getLanguages, updateLanguages } from '../../tasks/languages';
import { getConfig } from '../../tasks/config';

export function i18nCommand(message: string, value?: string) {
  const config = getConfig();
  const languages = getLanguages(config);

  languages.forEach(language => language.translate(message, value));

  updateLanguages(languages);
}
