import * as path from 'path';
import { copySync, pathExistsSync, removeSync } from 'fs-extra';
import { App } from '../app';
import { Config } from '../interfaces/config';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';

export function copyAssets(app: App) {
  if (pathExistsSync(path.join(app.config.src.folder, app.config.assets.folder))) {
    copySync(path.join(app.config.src.folder, app.config.assets.folder), app.config.dist.folder);
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
  const relativePath = path.relative(path.join(app.config.src.folder, app.config.assets.folder), srcPath);

  return path.join(app.config.dist.folder, relativePath);
}

export function getAssetsGlob(config: Config): string {
  return path.join(config.src.folder, config.assets.folder, `**/*`);
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
