import { PageId } from '../types';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { removeExtension } from '../helpers/path-helpers';
import { Environment } from '../interfaces/environment';
import { readFileSync } from 'fs';
import { AppConfig } from './app-config';
import * as path from 'path';
import { Code } from './code';
import { CssCodes } from './css-codes';
import { JsCodes } from './js-codes';

const idRegExp = /(\.inline)?\.\w+$/;

export class Page {
  id: PageId;
  absolutePathWithoutExt: string;
  content: string;
  relativeDistPath: string;
  defaultLanguageUrl: string;
  css: CssCodes;
  js: JsCodes;

  static createPageId(absolutePath: string): PageId {
    return absolutePath.replace(idRegExp, '');
  }

  constructor(public absolutePath: string, private config: AppConfig, private environment: Environment) {
    this.id = Page.createPageId(this.absolutePath);
    this.absolutePathWithoutExt = removeExtension(this.absolutePath);
    this.relativeDistPath = path.relative(config.pagesFolder, this.absolutePathWithoutExt) + '.html';
    this.defaultLanguageUrl = createAbsoluteUrl(this.relativeDistPath, config);
    this.css = new CssCodes(this.config.pagesFolder, this.absolutePathWithoutExt, this.config, this.environment);
    this.js = new JsCodes(this.config.pagesFolder, this.absolutePathWithoutExt, this.config, this.environment);
    this.updateContent();
  }

  updateContent() {
    this.content = readFileSync(this.absolutePath, 'utf-8');
  }

  distCode() {
    this.externalCode.forEach(code => code.dist());
  }

  get externalCode(): Code[] {
    return Code.getExternal(this.css.items.concat(this.js.items), this.environment);
  }

}
