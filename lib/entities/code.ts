import * as _ from 'lodash';
import { Url } from '../types';

class CodeType {
  inline: string[] = [];
  external: Url[] = [];
}

class CodeData {
  css = new CodeType();
  js = new CodeType();
}

export class Code extends CodeData {
  append(data: CodeData): Code {
    const newCode = new Code();
    newCode.css.inline = _.concat(this.css.inline, data.css.inline);
    newCode.css.external = _.concat(this.css.external, data.css.external);
    newCode.js.inline = _.concat(this.js.inline, data.js.inline);
    newCode.js.external = _.concat(this.js.external, data.js.external);
    return newCode;
  }
}
