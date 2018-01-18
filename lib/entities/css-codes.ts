import { AppConfig } from './app-config';
import { Codes } from './codes';
import { CssCode } from './css-code';

export class CssCodes extends Codes {
  constructor(host: string, base: string, config: AppConfig) {
    super(host, base, config.styles.extension, CssCode, config);
  }
}
