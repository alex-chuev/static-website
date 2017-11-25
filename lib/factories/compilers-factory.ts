import { StylusCompiler } from '../compilers/styles/stylus-compiler';
import { PugCompiler } from '../compilers/pages/pug-compiler';
import { Compilers } from '../interfaces/compilers';
import { Compiler } from '../compilers/compiler';
import { TypescriptCompiler } from '../compilers/scripts/typescript-compiler';
import { Options } from '../interfaces/options';

export class CompilersFactory {
  static createCompilers(options: Options): Compilers {
    return {
      templates: this.createTemplatesCompiler(options),
      styles: this.createStylesCompiler(options),
      scripts: this.createScriptsCompiler(options),
    };
  }

  private static createTemplatesCompiler(options: Options): Compiler {
    switch (options.pages.extension) {
      case 'pug':
      default:
        return new PugCompiler(options);
    }
  }

  private static createStylesCompiler(options: Options): Compiler {
    switch (options.styles.extension) {
      case 'styl':
      default:
        return new StylusCompiler(options);
    }
  }

  private static createScriptsCompiler(options: Options): Compiler {
    switch (options.scripts.extension) {
      case 'ts':
      default:
        return new TypescriptCompiler(options);
    }
  }
}
