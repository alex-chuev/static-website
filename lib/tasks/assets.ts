import * as path from 'path';
import { copySync, pathExistsSync, removeSync } from 'fs-extra';
import { App } from '../app';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';

export function copyAssets(app: App) {
  if (pathExistsSync(app.config.assetsFolder)) {
    copySync(app.config.assetsFolder, app.config.dist.folder);
  }
}

export function copyAssetToDist(srcPath: string, app: App): string {
  const distPath = getAssetDistPath(srcPath, app);

  copySync(srcPath, distPath);

  return distPath;
}

export function unlinkDistAsset(srcPath: string, app: App): string {
  const distPath = getAssetDistPath(srcPath, app);

  removeSync(distPath);

  return distPath;
}

export function getAssetDistPath(srcPath: string, app: App): string {
  return path.join(app.config.dist.folder, path.relative(app.config.assetsFolder, srcPath));
}

export function onAssetsWatchEvent(event: WatchEvent) {
  switch (event.action) {
    case WatchAction.Add:
    case WatchAction.Change:
      copyAssetToDist(event.file, event.app);
      break;
    case WatchAction.Unlink:
      unlinkDistAsset(event.file, event.app);
      break;
  }
}
