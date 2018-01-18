import { PagesCodeListener } from './pages-code-listener';

export class PagesScriptsListener extends PagesCodeListener {

  property = 'js';
  glob = this.app.config.pagesScriptsGlob;

}
