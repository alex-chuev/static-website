import { Config } from '../interfaces/config';
import { Environment } from '../interfaces/environment';
import * as stylus from 'stylus';
import { readFileSync } from 'fs';
import { minify } from 'uglify-js';
import { transpileModule } from 'typescript';
import * as path from 'path';
import { removeExtension } from '../helpers/path-helpers';
import { createAbsoluteUrl } from '../helpers/url-helpers';

export abstract class Code {
  content: string;
  fullPath: string;
  relativePathWithoutExt: string;
  fullPathWithoutExt: string;

  protected abstract getContent();

  abstract ext: string;

  constructor(
    public basePath: string,
    public relativePath: string,
    public config: Config,
    public environment: Environment,
  ) {
    this.fullPath = path.join(this.basePath, this.relativePath);
    this.relativePathWithoutExt = removeExtension(this.relativePath);
    this.fullPathWithoutExt = path.join(this.basePath, this.relativePathWithoutExt);

    this.getContent();
  }

  get url(): string {
    return createAbsoluteUrl(`${this.relativePathWithoutExt}.${this.ext}`, this.config);
  };
}

export class JsCode extends Code {
  ext = 'js';

  getContent() {
    if (this.environment.production) {
      this.content = minify(transpileModule(readFileSync(this.fullPath, 'utf-8'), this.config.scripts.options).outputText).code;
    } else {
      this.content = transpileModule(readFileSync(this.fullPath, 'utf-8'), this.config.scripts.options).outputText;
    }
  }
}

export class CssCode extends Code {
  ext = 'css';

  getContent() {
    stylus(readFileSync(this.fullPath, 'utf-8'))
      .set('filename', this.fullPath)
      .set('compress', this.environment.production)
      .render((error, content) => this.content = content);
  }
}
