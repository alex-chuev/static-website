import { render } from '../../render';
import { loadOptions } from '../utls/load-options';

export function build(command: any) {
  render(loadOptions(command));
}
