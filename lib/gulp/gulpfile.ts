import * as gulp from 'gulp';
import * as clean from 'gulp-clean';
import * as sitemap from 'gulp-sitemap';

import { loadOptions } from '../cli/utils/load-options';

import { cleanDist } from './clean';
import { assets } from './assets';
import { compilePages } from './pages';
import { generateSitemap } from './sitemap';

const options = loadOptions();

gulp.task('clean', cleanDist.bind(null, options));
gulp.task('assets', assets.bind(null, options));
gulp.task('pages', compilePages.bind(null, options));
gulp.task('sitemap', generateSitemap.bind(null, options));

gulp.task('build', gulp.series('clean', 'assets', 'pages', 'sitemap'));
gulp.task('default', gulp.series('build'));
