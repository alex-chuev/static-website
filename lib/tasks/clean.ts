import * as vfs from 'vinyl-fs';
import * as clean from 'gulp-clean';

import { Config } from '../interfaces/config';

export function cleanDist(options: Config) {
  return vfs.src(options.dist.folder, {
    read: false,
    allowEmpty: true,
  })
    .pipe(clean());
}
