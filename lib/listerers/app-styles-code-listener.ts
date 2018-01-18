import { AppCodeListener } from './app-code-listener';

export class AppStylesCodeListener extends AppCodeListener {

  property = 'css';
  glob = this.app.config.stylesGlob;

}
