import * as path from 'path';
import { AppConfig } from '../app/app-config';
import { PathHelpers } from '../../helpers/path-helpers';
import { createAbsoluteUrl } from '../../helpers/url-helpers';
import { distContent, unlinkFile } from '../../helpers/dist-helpers';
import { FileObject } from '../file-object';

export abstract class Code {

  abstract compile(content: string, data?: any): string;

  abstract distExt: string;
  content: string;

  constructor(public file: FileObject, public root: string, public config: AppConfig) {
    this.updateContent();
  }

  updateContent() {
    this.content = this.file.read();
  }

  get url(): string {
    return createAbsoluteUrl(this.relativeDistPath, this.config);
  }

  dist() {
    distContent(this.content, this.distPath);
  }

  get distPath(): string {
    return path.join(this.config.dist.folder, this.relativeDistPath);
  }

  get relativeDistPath(): string {
    return `${this.relativePathWithoutExt}.${this.distExt}`;
  }

  get relativePathWithoutExt(): string {
    return PathHelpers.removeExtension(this.relativePath);
  }

  get relativePath(): string {
    return path.relative(this.root, this.file.absolutePath);
  }

  get external(): boolean {
    return false === this.inline;
  }

  get inline(): boolean {
    return this.file.absolutePath.search(/\.inline\.\w+$/) !== -1;
  }

  undist() {
    unlinkFile(this.distPath);
  }

}
