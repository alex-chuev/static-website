import * as gulp from 'gulp';
import * as File from 'vinyl';
import { Config } from './interfaces/config';
import { Environment } from './interfaces/environment';
import { Language } from './entities/language';
import * as path from 'path';

class Cache {
  config: Config;
  environment: Environment;
  globalInlineCss: string;
  globalInlineJs: string;
  globalExternalCss: string;
  globalExternalJs: string;
  languages: { [languageName: string]: Language };
  pageFiles: { [pagePath: string]: File };
  pageInlineCss: { [pagePath: string]: string };
  pageInlineJs: { [pagePath: string]: string };
  pageExternalCss: { [pagePath: string]: string };
  pageExternalJs: { [pagePath: string]: string };
}

function build(languages, pageFiles) {
}
