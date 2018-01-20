import { AppCodeListener } from './app-code-listener';

export class AppScriptsCodeListener extends AppCodeListener {

  root = this.app.config.scriptsFolder;
  glob = this.app.config.scriptsGlob;

}
