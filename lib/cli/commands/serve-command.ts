import { loadOptions } from '../utils/load-options';
import { serve } from '../../gulp/gulpfile';

export function serveCommand() {
  serve(loadOptions(), {
    production: false,
  });
}
