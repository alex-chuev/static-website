import { loadOptions } from '../utils/load-options';
import { build } from '../../tasks/gulpfile';

export function buildCommand() {
  build(loadOptions(), {
    production: true,
  });
}
