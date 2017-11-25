import { Url } from '../types';
import { Compilers } from '../interfaces/compilers';
import { Options } from '../interfaces/options';
import { renderCode } from './render-code';

export function renderStyles(compilers: Compilers, options: Options): Url {
  return renderCode(compilers.styles, options.styles.folder, options.styles.extension, 'css', options);
}
