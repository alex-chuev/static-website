import { Listener } from './listener';
import { App } from '../entities/app/app';
import { FileObject } from '../entities/file-object';
import { Compiler } from '../entities/compiler/compiler';

export class TypescriptListener extends Listener {

  constructor(app: App, private compiler: Compiler) {
    super(app);
  }

  test(file: FileObject): boolean {
    return this.compiler.typescriptCompiler.shouldFileBeCompiled(file);
  }

  add(file: FileObject) {
    this.compiler.typescriptCompiler.addFileAndRestartWatching(file);
  }

  change(file: FileObject) {
    // There's nothing to do here, because the webpack will do all the work itself.
  }

  unlink(file: FileObject) {
    this.compiler.typescriptCompiler.removeFileAndRestartWatching(file);
  }

}
