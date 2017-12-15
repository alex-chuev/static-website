import * as gulp from 'gulp';
import * as clean from 'gulp-clean';
import * as sitemap from 'gulp-sitemap';
import { create } from 'browser-sync';

import { loadOptions } from '../cli/utils/load-options';

import { cleanDist } from './clean';
import { assets } from './assets';
import { compilePages } from './pages';
import { generateSitemap } from './sitemap';
import { Options } from '../interfaces/options';
import { Environment } from '../interfaces/environment';

const options = loadOptions();
const browserSync = create();

gulp.task('clean', cleanDist.bind(null, options));
gulp.task('assets', assets.bind(null, options));
gulp.task('pages', compilePages.bind(null, options));
gulp.task('sitemap', generateSitemap.bind(null, options));

gulp.task('build', gulp.series('clean', 'assets', 'pages', 'sitemap'));
gulp.task('default', gulp.series('build'));

export const build = (options: Options, environment: Environment) => {
};

export const serve = (options: Options, environment: Environment) => {
  browserSync.init({
    server: options.dist.folder,
  });

  gulp.watch(options.dist.folder).on('change', browserSync.reload);
};
