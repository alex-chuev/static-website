import { Listener } from './listener';
import * as minimatch from 'minimatch';
import { FileObject } from '../entities/file-object';

export class AssetsListener extends Listener {

  test(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.app.config.assetsGlob);
  }

  add(file: FileObject) {
    this.app.assets.distFile(file);
  }

  change(file: FileObject) {
    this.add(file);
  }

  unlink(file: FileObject) {
    this.app.assets.unlinkAsset(file);
  }

}
