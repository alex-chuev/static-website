import { promiseLanguages } from '../../tasks/languages';
import { getConfig } from '../../tasks/config';
import { promiseUpdateTranslations } from '../../tasks/translations';

export function i18nCommand(message: string, value?: string) {
  const config = getConfig();

  promiseLanguages(config)
    .then(languages => {
      languages.forEach(language => {
        language.translate(message, value);
      });

      return promiseUpdateTranslations(config, languages);
    });
}
