import { Code } from './code';
import { PageId, Url } from '../../types';
import { AppConfig } from '../app/app-config';
import { UrlHelpers } from '../../helpers/url-helpers';
import { PageData } from '../page-data';
import * as pug from 'pug';
import { StaticCode } from './static-code';
import { FileObject } from '../file-object';
import { StaticCodes } from './static-codes';
import { DistHelpers } from '../../helpers/dist-helpers';
import { Language } from '../language';
import * as path from 'path';

const idRegExp = /(\.inline)?\.\w+$/;

export class Page extends Code {

  id = Page.createPageId(this.file);

  codes: StaticCodes;

  distExt = 'html';

  static createPageId(file: FileObject): PageId {
    return file.absolutePath.replace(idRegExp, '');
  }

  constructor(file: FileObject, config: AppConfig) {
    super(file, config.pagesFolder, config);

    this.codes = new StaticCodes([
      {root: config.pagesFolder, pattern: `${this.file.absolutePathWithoutExt}?(.inline).${this.config.styles.extension}`},
      {root: config.pagesFolder, pattern: `${this.file.absolutePathWithoutExt}?(.inline).${this.config.scripts.extension}`},
    ], config);
  }

  build(data: PageData, language: Language) {
    this.distLanguage(this.compile(this.content, data), language);
  }

  compile(content: string, data: PageData): string {
    return pug.render(content, {...data, filename: data.file.absolutePath});
  }

  private distLanguage(content: string, language: Language) {
    DistHelpers.content(content, this.getDistPath(language));
  }

  createLanguageUrl(language: Language): string {
    return UrlHelpers.createAbsoluteUrl(path.join(language.url, this.relativeDistPath), this.config);
  }

  getDistPath(language: Language) {
    return path.join(this.config.dist.folder, language.url, this.relativeDistPath);
  }

  get defaultLanguageUrl(): Url {
    return UrlHelpers.createAbsoluteUrl(this.relativeDistPath, this.config);
  }

  distCode() {
    this.externalCode.forEach(code => code.dist());
  }

  undistLanguage(language: Language) {
    DistHelpers.unlink(this.getDistPath(language));
  }

  get externalCode(): StaticCode[] {
    return StaticCode.getExternal(this.codes.items, this.config);
  }

}
