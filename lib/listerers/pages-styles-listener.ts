import { PagesCodeListener } from './pages-code-listener';

export class PagesStylesListener extends PagesCodeListener {

  glob = this.app.config.pagesStylesGlob;

}
