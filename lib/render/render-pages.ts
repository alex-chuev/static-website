import { renderPageStyles } from './render-page-styles';
import { renderPageScripts } from './render-page-scripts';
import { renderPageTemplate } from './render-page-template';
import { Code } from '../interfaces/code';
import { State } from '../state';

export function renderPages(state: State) {
  state.pages.forEach(page => {
    const css: Code = renderPageStyles(page, state);
    const js: Code = renderPageScripts(page, state);

    if (state.css) {
      css.external.unshift(state.css);
    }

    if (state.js) {
      js.external.unshift(state.js);
    }

    state.translations.forEach(
      translation => renderPageTemplate(page, translation, {css, js}, state),
    );
  });
}
