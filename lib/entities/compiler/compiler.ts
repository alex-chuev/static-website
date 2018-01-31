import { AppConfig } from '../app/app-config';
import { AppTypescriptCompiler } from './typescript-compiler';

export class Compiler {

  typescriptCompiler = new AppTypescriptCompiler(this.config);

  constructor(private config: AppConfig) {
  }

  watch() {
    this.typescriptCompiler.watch();
  }

  compile(): Promise<void[]> {
    return Promise.all([
      this.typescriptCompiler.compile(),
    ]);
  }

}
