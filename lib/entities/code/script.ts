import { execFileSync } from 'child_process';
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
    const js = execFileSync('./node_modules/.bin/browserify', [this.file.absolutePath, '-p', '[tsify]'])
      .toString();

    console.log(js);

    return this.config.production ? minify(js).code : js;
  }

}
