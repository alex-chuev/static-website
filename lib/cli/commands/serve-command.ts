import { watchTree } from 'watch';
import * as ls from 'live-server';
import { build } from '../../build';
import { loadOptions } from '../utils/load-options';
import { Options } from '../../interfaces/options';

export function serveCommand(command: any) {
  const options = loadOptions(command);
  options.dist.clean = false;
  options.dist.folder = 'serve';

  watchTree(options.src.folder, {
    interval: 0.15,
  }, () => rebuild(options));

  ls.start({
    root: options.dist.folder,
    host: options.serve.host,
    port: options.serve.port,
    open: options.serve.open,
    logLevel: 0,
  });
}

function rebuild(options: Options) {
  console.log('\x1b[32m\nRebuilding...\x1b[0m');

  build(options);

  console.log('\x1b[32mRebuilt successfully.\x1b[0m');
}
