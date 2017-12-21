import * as path from 'path';
import { copySync, pathExistsSync, removeSync } from 'fs-extra';
import { App } from '../app';

export function copyAssets(app: App) {
  if (pathExistsSync(path.join(app.config.src.folder, app.config.assets.folder))) {
    copySync(path.join(app.config.src.folder, app.config.assets.folder), app.config.dist.folder);
  }
}

export function copyAsset(srcPath: string, app: App): string {
  const distPath = getAssetDistPath(srcPath, app);

  copySync(srcPath, distPath);

  return distPath;
}

export function unlinkAsset(srcPath: string, app: App): string {
  const distPath = getAssetDistPath(srcPath, app);

  removeSync(distPath);

  return distPath;
}

export function getAssetDistPath(srcPath: string, app: App): string {
  const relativePath = path.relative(path.join(app.config.src.folder, app.config.assets.folder), srcPath);

  return path.join(app.config.dist.folder, relativePath);
}
