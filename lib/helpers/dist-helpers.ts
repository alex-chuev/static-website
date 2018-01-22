import { copySync, outputFileSync, pathExistsSync, removeSync } from 'fs-extra';
import EventEmitter = NodeJS.EventEmitter;

export class DistHelpers {

  static onDist = new EventEmitter();

  static file(srcPath: string, distPath: string) {
    if (pathExistsSync(srcPath)) {
      copySync(srcPath, distPath);
      this.onDist.emit(distPath);
      this.log(distPath);
    }
  }

  static unlink(distPath: string) {
    if (pathExistsSync(distPath)) {
      removeSync(distPath);
      this.onDist.emit(distPath);
      this.log(distPath, '-');
    }
  }

  static content(content: string, distPath: string) {
    outputFileSync(distPath, content);
    this.onDist.emit(distPath);
    this.log(distPath);
  }

  private static log(distPath: string, prefix = '>') {
    console.log(prefix, distPath);
  }

}
