import { Code } from '../interfaces/code';
import { renderPageCode } from './render-page-code';
import { State } from '../state';
import { FilePath } from '../types';

export function renderPageScripts(page: FilePath, state: State): Code {
  return renderPageCode(page, state.compilers.scripts, state.options.scripts.extension, 'js', state);
}
