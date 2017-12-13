import * as gulp from 'gulp';
import * as clean from 'gulp-clean';
import * as sitemap from 'gulp-sitemap';

import { loadOptions } from '../cli/utils/load-options';
import { assets, watchAssets } from './assets';
import { cleanDist } from './clean';
import { generateSitemap } from './sitemap';
import { compilePages } from './pages';
import { compileStyles } from './styles';
import { compileScripts } from './scripts';

const options = loadOptions();

gulp.task('assets', assets.bind(null, options));
gulp.task('watch', () => {
  watchAssets(options);
});

gulp.task('clean', cleanDist.bind(null, options));
gulp.task('pages', compilePages.bind(null, options));
gulp.task('styles', compileStyles.bind(null, options));
gulp.task('scripts', compileScripts.bind(null, options));
gulp.task('sitemap', generateSitemap.bind(null, options));

gulp.task('build', gulp.series('clean', 'assets', 'styles'/*, 'scripts'*/, 'pages', 'sitemap'));
gulp.task('default', gulp.parallel('build'/*, 'watch'*/));
