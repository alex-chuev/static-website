import { AppConfig } from './app-config';
import { Environment } from '../interfaces/environment';
import { Codes } from './codes';
import { CssCode } from './css-code';

export class CssCodes extends Codes {
  constructor(host: string, base: string, config: AppConfig, environment: Environment) {
    super(host, base, config.styles.extension, CssCode, config, environment);
  }
}
