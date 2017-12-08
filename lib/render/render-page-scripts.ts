import { Code } from '../interfaces/code';
import { renderPageCode } from './render-page-code';
import { State } from '../state';
import { FilePath } from '../types';
import { Language } from '../entities/language';

export function renderPageScripts(page: FilePath, language: Language, state: State): Code {
  return renderPageCode(page, language, state.compilers.scripts, state.options.scripts.extension, 'js', state);
}
