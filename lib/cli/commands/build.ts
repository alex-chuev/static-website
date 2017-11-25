import { build as _build } from '../../build';
import { loadOptions } from '../utls/load-options';

export function build(command: any) {
  _build(loadOptions(command));
}
