import * as path from 'path';
import * as glob from 'glob';
import { AppConfig } from './app-config';
import { DistHelpers } from '../../helpers/dist-helpers';
import { FileObject } from '../file-object';

export class AppAssets {

  constructor(private config: AppConfig) {
  }

  dist() {
    glob.sync(this.config.assetsGlob)
      .forEach(filePath => this.distFile(new FileObject(filePath)));
  }

  distFile(file: FileObject) {
    DistHelpers.file(file.absolutePath, this.getDistPath(file));
  }

  unlinkAsset(file: FileObject) {
    DistHelpers.unlink(this.getDistPath(file));
  }

  private getDistPath(file: FileObject): string {
    return path.join(this.config.dist.folder, path.relative(this.config.assetsFolder, file.absolutePath));
  }

}
