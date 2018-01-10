import { readFileSync } from 'fs';
import * as stylus from 'stylus';
import { Code } from './code';

export class CssCode extends Code {
  compile() {
    let content;

    stylus(readFileSync(this.absolutePath, 'utf-8'))
      .set('filename', this.absolutePath)
      .set('compress', this.environment.production)
      .render((error, js) => content = js);

    return content;
  }

  get ext(): string {
    return 'css';
  }

  get inline(): boolean {
    return this.absolutePath.indexOf(`.inline.${this.config.styles.extension}`) !== -1;
  }
}
