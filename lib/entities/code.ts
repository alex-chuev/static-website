import { AppConfig } from './app-config';
import { Environment } from '../interfaces/environment';
import * as path from 'path';
import * as _ from 'lodash';
import { createAbsoluteUrl } from '../helpers/url-helpers';
import { outputFileSync } from 'fs-extra';
import { Page } from './page';
import { PageId } from '../types';
import { CodeParams } from '../interfaces/code-params';

export abstract class Code {
  content: string;
  pageId: PageId;
  host: string;
  file: string;
  config: AppConfig;
  environment: Environment;

  protected abstract compile(): string;

  abstract get ext(): string;

  abstract get inline(): boolean;

  static getExternal(codes: Code[], environment: Environment): Code[] {
    return environment.production ? _.filter(codes, code => code.external) : codes;
  }

  constructor(params: CodeParams) {
    this.host = params.host;
    this.file = params.file;
    this.config = params.config;
    this.environment = params.environment;
    this.pageId = Page.createPageId(this.file, this.config);
    this.content = this.compile();
  }

  get url(): string {
    return createAbsoluteUrl(`${this.pageId}.${this.ext}`, this.config);
  };

  get distPath(): string {
    return path.join(this.config.dist.folder, `${this.pageId}.${this.ext}`);
  };

  get external(): boolean {
    return false === this.inline;
  };

  dist() {
    outputFileSync(this.distPath, this.content);
  }
}
