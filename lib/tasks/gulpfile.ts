import * as gulp from 'gulp';
import { create } from 'browser-sync';
import { loadOptions } from '../cli/utils/load-options';
import { cleanDist } from './clean';
import { copyAssets } from './assets';
import { generateSitemap } from './sitemap';
import { Options } from '../interfaces/options';
import { Environment } from '../interfaces/environment';
import { compilePages } from './pages';

const options = loadOptions();

gulp.task('clean', cleanDist.bind(null, options));
gulp.task('pages', compilePages.bind(null, options));
gulp.task('sitemap', generateSitemap.bind(null, options));
gulp.task('assets', copyAssets.bind(null, options));

gulp.task('compile', gulp.series('clean', 'pages', 'sitemap', 'assets'));
gulp.task('default', gulp.series('compile'));

export const compile = (options: Options, environment: Environment) => {
};

export const serve = (options: Options, environment: Environment) => {
  const browserSync = create();

  browserSync.init({
    server: options.dist.folder,
  });

  gulp.watch(options.dist.folder).on('change', browserSync.reload);
};
