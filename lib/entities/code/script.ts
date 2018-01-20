import { ScriptTarget, transpileModule } from 'typescript';
import { minify } from 'uglify-js';
import { StaticCode } from './static-code';
import { AppConfig } from '../app/app-config';
import { PathHelpers } from '../../helpers/path-helpers';
import { FileObject } from '../file-object';

export class Script extends StaticCode {

  distExt = 'js';

  static test(file: FileObject, config: AppConfig): boolean {
    return PathHelpers.getExtension(file.absolutePath) === config.scripts.extension;
  }

  compile(content: string): string {
    const js = transpileModule(content, {
      compilerOptions: {
        target: ScriptTarget.ES5,
      },
    }).outputText;

    return this.config.production ? minify(js).code : js;
  }

}
