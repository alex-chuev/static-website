import { readFileSync } from 'fs';
import * as stylus from 'stylus';
import { Code } from './code';

export class CssCode extends Code {
  compile() {
    let content;

    stylus(readFileSync(this.file, 'utf-8'))
      .set('filename', this.file)
      .set('compress', this.environment.production)
      .render((error, js) => content = js);

    return content;
  }

  get ext(): string {
    return 'css';
  }

  get inline(): boolean {
    return this.file.indexOf(`.inline.${this.config.styles.extension}`) !== -1;
  }
}
