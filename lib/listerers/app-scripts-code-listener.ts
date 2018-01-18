import { AppCodeListener } from './app-code-listener';

export class AppScriptsCodeListener extends AppCodeListener {

  property = 'js';
  glob = this.app.config.scriptsGlob;

}
