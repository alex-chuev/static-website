import { Code } from '../interfaces/code';
import { renderPageCode } from './render-page-code';
import { State } from '../state';
import { FilePath } from '../types';

export function renderPageStyles(page: FilePath, state: State): Code {
  return renderPageCode(page, state.compilers.styles, state.options.styles.extension, 'css', state);
}
