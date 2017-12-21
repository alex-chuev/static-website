import * as path from 'path';
import { Page } from '../entities/page';
import { Config } from '../interfaces/config';
import * as glob from 'glob';

export function getPages(config: Config): Page[] {
  return glob.sync(path.join(config.src.folder, config.pages.folder, `**/*.${config.pages.extension}`))
    .map(file => new Page(file, config));
}
