import { AppConfig } from './app-config';
import { StaticCodes } from '../code/static-codes';

export class AppStaticCodes extends StaticCodes {

  constructor(config: AppConfig) {
    super([
      {root: config.stylesFolder, pattern: config.stylesGlob},
      {root: config.scriptsFolder, pattern: config.scriptsGlob},
    ], config);
  }

}
