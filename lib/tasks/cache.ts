import { Environment } from '../interfaces/environment';
import { getLanguages } from './languages';
import { Config } from '../interfaces/config';
import { BuildCache } from '../cache';
import { getPages } from './pages';
import { getGlobalExternalCss, getGlobalInlineCss, getPageExternalCss, getPageInlineCss } from './styles';
import { getGlobalExternalJs, getGlobalInlineJs, getPageExternalJs, getPageInlineJs } from './scripts';

export function createBuildCache(config: Config, environment: Environment): BuildCache {
  const languages = getLanguages(config);
  const globalInlineCss = getGlobalInlineCss(config, environment);
  const globalInlineJs = getGlobalInlineJs(config, environment);
  const globalExternalCss = getGlobalExternalCss(config, environment);
  const globalExternalJs = getGlobalExternalJs(config, environment);
  const pages = getPages(config);
  const pageInlineCss = getPageInlineCss(config, environment, pages);
  const pageInlineJs = getPageInlineJs(config, environment, pages);
  const pageExternalCss = getPageExternalCss(config, environment, pages);
  const pageExternalJs = getPageExternalJs(config, environment, pages);

  return new BuildCache({
    config,
    environment,
    languages,
    globalInlineCss,
    globalInlineJs,
    globalExternalCss,
    globalExternalJs,
    pages,
    pageInlineCss,
    pageInlineJs,
    pageExternalCss,
    pageExternalJs,
  });
}
