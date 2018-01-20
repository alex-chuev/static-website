import * as stylus from 'stylus';
import { StaticCode } from './static-code';
import { PathHelpers } from '../../helpers/path-helpers';
import { AppConfig } from '../app/app-config';
import { FileObject } from '../file-object';

export class Style extends StaticCode {

  distExt = 'css';

  static test(file: FileObject, config: AppConfig): boolean {
    return PathHelpers.getExtension(file.absolutePath) === config.styles.extension;
  }

  compile(content: string): string {
    let css;

    stylus(content)
      .set('filename', this.file.absolutePath)
      .set('compress', this.config.production)
      .render((error, value) => css = value);

    return css;
  }

}
