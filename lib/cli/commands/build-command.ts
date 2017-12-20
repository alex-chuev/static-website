import { build } from '../../tasks/build';
import { getConfig } from '../../tasks/config';

export function buildCommand() {
  build(getConfig(), {
    production: true,
  });
}
