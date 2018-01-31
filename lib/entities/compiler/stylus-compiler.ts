import * as _ from 'lodash';
import { FileObject } from '../file-object';
import { AppConfig } from '../app/app-config';
import * as glob from 'glob';
import * as path from 'path';
import { AppPages } from '../app/app-pages';
import { Page } from '../code/page';
import * as minimatch from 'minimatch';
import { PageId } from '../../types';
import stylus = require('stylus');
import { outputFileSync } from 'fs-extra';

export class StylusCompiler {

  private files: FileObject[] = [];
  private existingPageIds: PageId[];

  constructor(private config: AppConfig) {
    this.existingPageIds = AppPages.getPageFiles(this.config)
      .map(file => Page.createPageId(file));

    this.files = glob.sync(path.join(this.config.srcFolder, '**/*.styl'))
      .map(filePath => new FileObject(filePath))
      .filter(file => this.shouldFileBeCompiled(file));
  }

  shouldFileBeCompiled(file: FileObject): boolean {
    return this.isAppTypescriptFile(file) || this.isPageTypescriptFile(file);
  }

  private isAppTypescriptFile(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.config.appTypescriptGlob);
  }

  private isPageTypescriptFile(file: FileObject) {
    if (false === minimatch(file.absolutePath, this.config.pagesTypescriptGlob)) {
      return false;
    }

    return _.includes(this.existingPageIds, Page.createPageId(file));
  }

  compile(): void {
    this.files.forEach(item => this.compileFile(item));
  }

  private compileFile(file: FileObject): void {
    const renderer = stylus(file.read())
      .set('filename', file.absolutePath)
      .set('compress', this.config.production);

    renderer
      .render((error, css) => {
        if (error) {
          console.error(error);
        } else {
          this.saveCss(file, css);
        }
      });
  }

  private saveCss(file: FileObject, css: string) {
    outputFileSync(`${file.absolutePathWithoutExt}.css`, css);
  }

}
