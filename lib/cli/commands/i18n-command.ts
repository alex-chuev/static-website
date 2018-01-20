import { AppConfig } from '../../entities/app/app-config';
import { AppLanguages } from '../../entities/app/app-languages';

export function i18nCommand(message: string, value?: string) {
  (new AppLanguages(new AppConfig())).addMessage(message, value);
}
