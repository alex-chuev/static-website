import { build as _build } from '../../build';
import { loadOptions } from '../utils/load-options';

export function build(command: any) {
  _build(loadOptions(command));
}
