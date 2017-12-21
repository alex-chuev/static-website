import { Config } from '../interfaces/config';
import { Environment } from '../interfaces/environment';
import * as stylus from 'stylus';
import { readFileSync } from 'fs';
import { minify } from 'uglify-js';
import { transpileModule } from 'typescript';
import * as path from 'path';
import { removeExtension } from '../helpers/path-helpers';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { App } from '../app';
import { outputFileSync } from 'fs-extra';
import { Page } from '../entities/page';

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

  get distPath(): string {
    return path.join(this.config.dist.folder, `${this.relativePathWithoutExt}.${this.ext}`);
  };
}

export class JsCode extends Code {
  ext = 'js';

  getContent() {
    const content = transpileModule(readFileSync(this.fullPath, 'utf-8'), this.config.scripts.options).outputText;
    this.content = this.environment.production ? minify(content).code : content;
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

export function saveExternalCss(app: App) {
  const code = [
    app.externalCss,
  ];

  saveExternalCode(app.environment.production ? code : code.concat(
    app.inlineCss,
  ));
}

export function saveExternalJs(app: App) {
  const code = [
    app.externalJs,
  ];

  saveExternalCode(app.environment.production ? code : code.concat(
    app.inlineJs,
  ));
}

export function savePageExternalCode(page: Page, app: App) {
  const code: Code[] = [
    app.pageExternalCss.get(page),
    app.pageExternalJs.get(page),
  ];

  saveExternalCode(app.environment.production ? code : code.concat(
    app.pageInlineCss.get(page),
    app.pageInlineJs.get(page),
  ));
}

function saveExternalCode(code: Code[]) {
  code
    .filter(item => item)
    .forEach(item => outputFileSync(item.distPath, item.content));
}
