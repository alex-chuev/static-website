import { PagesCodeListener } from './pages-code-listener';

export class PagesStylesListener extends PagesCodeListener {

  property = 'css';
  glob = this.app.config.pagesStylesGlob;

}
