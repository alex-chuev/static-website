import { Url } from '../types';
import { Compilers } from '../interfaces/compilers';
import { Options } from '../interfaces/options';
import { renderCode } from './render-code';

export function renderScripts(compilers: Compilers, options: Options): Url {
  return renderCode(compilers.scripts, options.scripts.folder, options.scripts.extension, 'js', options);
}
