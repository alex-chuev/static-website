import * as path from 'path';
import { BrowserSyncInstance, create } from 'browser-sync';
import { App } from '../entities/app/app';

export function serve(app: App): BrowserSyncInstance {
  return create().init({
    server: {
      baseDir: app.config.dist.folder,
    },
    files: path.join(app.config.dist.folder, '**/*'),
    watchOptions: {
      ignoreInitial: true,
    },
    reloadDebounce: 200,
    logLevel: 'silent',
  });
}
