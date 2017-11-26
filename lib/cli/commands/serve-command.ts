import { watchTree } from 'watch';
import * as ls from 'live-server';
import { build } from '../../build';
import { loadOptions } from '../utils/load-options';

export function serveCommand(command: any) {
  const options = loadOptions(command);

  watchTree('static', () => build(options));

  ls.start({
    root: options.dist.folder,
    host: options.serve.host,
    port: options.serve.port,
    open: options.serve.open,
  });
}
