import { build } from '../../tasks/build';

export function serveCommand() {
  build({
    production: false,
  });
}
