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

export class Page {
  id: PageId;
  fullPathWithoutExt: string;
  content: string;
  distPathWithExt: string;
  defaultLanguageUrl: string;
  css: CssCodes;
  js: JsCodes;

  static createPageId(file: string, config: AppConfig): PageId {
    return removeExtension(path.relative(config.pagesFolder, file));
  }

  constructor(public fullPath: string, private config: AppConfig, private environment: Environment) {
    this.id = Page.createPageId(this.fullPath, config);
    this.fullPathWithoutExt = removeExtension(this.fullPath);
    this.content = readFileSync(this.fullPath, 'utf-8');
    this.distPathWithExt = `${this.id}.html`;
    this.defaultLanguageUrl = createAbsoluteUrl(this.distPathWithExt, config);
    this.css = new CssCodes(this.config.pagesFolder, this.fullPathWithoutExt, this.config, this.environment);
    this.js = new JsCodes(this.config.pagesFolder, this.fullPathWithoutExt, this.config, this.environment);
  }

  distCode() {
    this.externalCode.forEach(code => code.dist());
  }

  get externalCode(): Code[] {
    return Code.getExternal(this.css.items.concat(this.js.items), this.environment);
  }

}
