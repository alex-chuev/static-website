import { serve } from '../../tasks/serve';

export function serveCommand() {
  serve({
    production: false,
  });
}
