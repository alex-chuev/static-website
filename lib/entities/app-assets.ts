import * as path from 'path';
import * as glob from 'glob';
import { WatchEvent } from '../interfaces/watch-event';
import { WatchAction } from '../enums/watch-action';
import { AppConfig } from './app-config';
import { distFile, unlinkDistFile } from '../helpers/dist-helpers';

export class AppAssets {

  constructor(private config: AppConfig) {
  }

  dist() {
    glob.sync(this.config.assetsGlob).forEach(file => this.distFile(file));
  }

  distFile(file: string) {
    distFile(file, this.getDistPath(file));
  }

  unlinkAsset(file: string) {
    unlinkDistFile(this.getDistPath(file));
  }

  private getDistPath(file: string): string {
    return path.join(this.config.dist.folder, path.relative(this.config.assetsFolder, file));
  }

}
