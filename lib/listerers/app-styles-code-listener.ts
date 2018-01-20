import { AppCodeListener } from './app-code-listener';

export class AppStylesCodeListener extends AppCodeListener {

  root = this.app.config.stylesFolder;
  glob = this.app.config.stylesGlob;

}
