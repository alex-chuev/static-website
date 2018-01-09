import * as path from 'path';
import * as glob from 'glob';
import { AppConfig } from './app-config';
import { distFile, undistFile } from '../helpers/dist-helpers';

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
    undistFile(this.getDistPath(file));
  }

  private getDistPath(file: string): string {
    return path.join(this.config.dist.folder, path.relative(this.config.assetsFolder, file));
  }

}
