import { AppConfig } from '../../entities/app-config';
import { AppLanguages } from '../../entities/app-languages';

export function i18nCommand(message: string, value?: string) {
  (new AppLanguages(new AppConfig())).addMessage(message, value);
}
