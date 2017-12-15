import { loadOptions } from '../utils/load-options';
import { compile } from '../../tasks/gulpfile';

export function buildCommand() {
  compile(loadOptions(), {
    production: true,
  });
}
