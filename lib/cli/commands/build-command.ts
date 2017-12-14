import { loadOptions } from '../utils/load-options';

export function buildCommand() {
  build(loadOptions(), {
    production: true,
  });
}
