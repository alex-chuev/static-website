import * as path from 'path';
import { copySync, pathExistsSync, removeSync } from 'fs-extra';
import { BuildCache } from '../cache';

export function copyAssets(cache: BuildCache) {
  if (pathExistsSync(path.join(cache.config.src.folder, cache.config.assets.folder))) {
    copySync(path.join(cache.config.src.folder, cache.config.assets.folder), cache.config.dist.folder);
  }
}

export function copyAsset(srcPath: string, cache: BuildCache): string {
  const distPath = getAssetDistPath(srcPath, cache);

  copySync(srcPath, distPath);

  return distPath;
}

export function unlinkAsset(srcPath: string, cache: BuildCache): string {
  const distPath = getAssetDistPath(srcPath, cache);

  removeSync(distPath);

  return distPath;
}

export function getAssetDistPath(srcPath: string, cache: BuildCache): string {
  const relativePath = path.relative(path.join(cache.config.src.folder, cache.config.assets.folder), srcPath);

  return path.join(cache.config.dist.folder, relativePath);
}
