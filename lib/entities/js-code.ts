import { readFileSync } from 'fs';
import { ScriptTarget, transpileModule } from 'typescript';
import { minify } from 'uglify-js';
import { Code } from './code';

export class JsCode extends Code {
  compile() {
    const content = transpileModule(readFileSync(this.file, 'utf-8'), {
      compilerOptions: {
        target: ScriptTarget.ES5,
      },
    }).outputText;
    return this.environment.production ? minify(content).code : content;
  }

  get ext(): string {
    return 'js';
  }

  get inline(): boolean {
    return this.file.indexOf(`.inline.${this.config.scripts.extension}`) !== -1;
  }
}
