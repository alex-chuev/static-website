import { copySync, pathExistsSync, removeSync } from 'fs-extra';
import * as path from "path";
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import { AppConfig } from './app-config';

export class AppAssets {

  constructor(private config: AppConfig) {
  }

  dist() {
    if (pathExistsSync(this.config.assetsFolder)) {
      copySync(this.config.assetsFolder, this.config.dist.folder);
    }
  }

  distFile(file: string) {
    copySync(file, this.getDistPath(file));
  }

  unlinkDistFile(file: string) {
    removeSync(this.getDistPath(file));
  }

  private getDistPath(file: string): string {
    return path.join(this.config.dist.folder, path.relative(this.config.assetsFolder, file));
  }

  onWatchEvent(event: WatchEvent) {
    switch (event.action) {
      case WatchAction.Add:
      case WatchAction.Change:
        this.distFile(event.file);
        break;
      case WatchAction.Unlink:
        this.unlinkDistFile(event.file);
        break;
    }
  }

}
