import { Code } from './code';
import { File } from 'gulp-util';

export class PageCode {
  css = new Code();
  js = new Code();

  constructor(data: File[][]) {
    this.css.external = data[0];
    this.css.inline = data[1];
    this.js.external = data[2];
    this.css.inline = data[3];
  }
}
