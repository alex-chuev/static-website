import { Environment } from '../interfaces/environment';
import { getLanguages } from './languages';
import { App } from '../app';
import { getPages } from './pages';
import { getGlobalCss, getPageCss } from './styles';
import { getGlobalJs, getPageJs } from './scripts';
import { getConfig } from './config';

export function createApp(environment: Environment): App {
  const config = getConfig();
  const languages = getLanguages(config);
  const globalInlineCss = getGlobalCss(config, environment, true);
  const globalInlineJs = getGlobalJs(config, environment, true);
  const globalExternalCss = getGlobalCss(config, environment);
  const globalExternalJs = getGlobalJs(config, environment);
  const pages = getPages(config);
  const pageInlineCss = getPageCss(config, environment, pages, true);
  const pageInlineJs = getPageJs(config, environment, pages, true);
  const pageExternalCss = getPageCss(config, environment, pages);
  const pageExternalJs = getPageJs(config, environment, pages);

  return new App({
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
