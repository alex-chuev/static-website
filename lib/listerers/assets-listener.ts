import { Listener } from './listener';
import * as minimatch from 'minimatch';

export class AssetsListener extends Listener {

  test(absolutePath: string): boolean {
    return minimatch(absolutePath, this.app.config.assetsGlob);
  }

  add(absolutePath: string) {
    this.app.assets.distFile(absolutePath);
  }

  change(absolutePath: string) {
    this.add(absolutePath);
  }

  unlink(absolutePath: string) {
    this.app.assets.unlinkAsset(absolutePath);
  }

}
