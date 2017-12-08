import { Code } from '../interfaces/code';
import { renderPageCode } from './render-page-code';
import { State } from '../state';
import { FilePath } from '../types';
import { Language } from '../entities/language';

export function renderPageStyles(page: FilePath, language: Language, state: State): Code {
  return renderPageCode(page, language, state.compilers.styles, state.options.styles.extension, 'css', state);
}
