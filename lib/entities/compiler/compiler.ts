import { AppConfig } from '../app/app-config';
import { TypescriptCompiler } from './typescript-compiler';
import { StylusCompiler } from './stylus-compiler';

export class Compiler {

  typescriptCompiler = new TypescriptCompiler(this.config);
  stylusCompiler = new StylusCompiler(this.config);

  constructor(private config: AppConfig) {
  }

  watch() {
    this.typescriptCompiler.watch();
  }

  compile(): Promise<void[]> {
    return Promise.all([
      this.typescriptCompiler.compile(),
      this.stylusCompiler.compile(),
    ]);
  }

}
