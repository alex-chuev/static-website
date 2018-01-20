import { PagesCodeListener } from './pages-code-listener';

export class PagesScriptsListener extends PagesCodeListener {

  glob = this.app.config.pagesScriptsGlob;

}
