import * as path from 'path';
import * as glob from 'glob';
import { AppConfig } from './app-config';
import { distFile, undistFile } from '../helpers/dist-helpers';

export class AppAssets {

  constructor(private config: AppConfig) {
  }

  dist() {
    glob.sync(this.config.assetsGlob)
      .forEach(relativePath => this.distFile(path.resolve(relativePath)));
  }

  distFile(absolutePath: string) {
    distFile(absolutePath, this.getDistPath(absolutePath));
  }

  unlinkAsset(absolutePath: string) {
    undistFile(this.getDistPath(absolutePath));
  }

  private getDistPath(absolutePath: string): string {
    return path.join(this.config.dist.folder, path.relative(this.config.assetsFolder, absolutePath));
  }

}
