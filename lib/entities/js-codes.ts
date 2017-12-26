import { AppConfig } from './app-config';
import { Environment } from '../interfaces/environment';
import { Codes } from './codes';
import { JsCode } from './js-code';

export class JsCodes extends Codes {
  constructor(host: string, base: string, config: AppConfig, environment: Environment) {
    super(host, base, config.scripts.extension, JsCode, config, environment);
  }
}
