import { build } from '../../build';
import { loadOptions } from '../utils/load-options';

export function buildCommand(command: any) {
  build(loadOptions(command), {
    production: true,
  });
}
