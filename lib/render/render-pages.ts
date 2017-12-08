import { renderPageStyles } from './render-page-styles';
import { renderPageScripts } from './render-page-scripts';
import { renderPageTemplate } from './render-page-template';
import { State } from '../state';

export function renderPages(state: State) {
  state.pages.forEach(page => {
    state.languages.forEach(language => {
      const css = renderPageStyles(page, language, state);
      const js = renderPageScripts(page, language, state);

      if (state.css) {
        css.external.unshift(state.css);
      }

      if (state.js) {
        js.external.unshift(state.js);
      }

      renderPageTemplate(page, language, {css, js}, state);
    });
  });
}
