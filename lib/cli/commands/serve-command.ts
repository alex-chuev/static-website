import { loadOptions } from '../utils/load-options';
import { serve } from '../../tasks/gulpfile';

export function serveCommand() {
  serve(loadOptions(), {
    production: false,
  });
}
