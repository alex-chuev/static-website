import { build } from '../../tasks/build';

export function buildCommand() {
  build({
    production: true,
  });
}
