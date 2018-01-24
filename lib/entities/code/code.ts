import * as path from 'path';
import { AppConfig } from '../app/app-config';
import { PathHelpers } from '../../helpers/path-helpers';
import { UrlHelpers } from '../../helpers/url-helpers';
import { DistHelpers } from '../../helpers/dist-helpers';
import { FileObject } from '../file-object';

export class Code {

  content: string;

  constructor(public file: FileObject, public root: string, public config: AppConfig) {
    this.updateContent();
  }

  updateContent() {
    this.content = this.file.read();
  }

  get url(): string {
    return UrlHelpers.createAbsoluteUrl(this.relativeDistPath, this.config);
  }

  dist() {
    DistHelpers.content(this.content, this.distPath);
  }

  get distPath(): string {
    return path.join(this.config.dist.folder, this.relativeDistPath);
  }

  get relativeDistPath(): string {
    return `${this.relativePathWithoutExt}.${this.file.extension}`;
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
    DistHelpers.unlink(this.distPath);
  }

}
