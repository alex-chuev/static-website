import { loadOptions } from '../utils/load-options';
import { build } from '../../gulp/gulpfile';

export function buildCommand() {
  build(loadOptions(), {
    production: true,
  });
}
