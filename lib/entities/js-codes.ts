import { AppConfig } from './app-config';
import { Codes } from './codes';
import { JsCode } from './js-code';

export class JsCodes extends Codes {
  constructor(host: string, base: string, config: AppConfig) {
    super(host, base, config.scripts.extension, JsCode, config);
  }
}
