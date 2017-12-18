import { Environment } from '../interfaces/environment';
import { promiseLanguages } from './languages';
import { getConfig } from './config';
import { promisePages } from './pages';
import { promiseGenerateSitemap } from './sitemap';
import { promiseGenerateTranslations } from './translations';

export async function build(environment: Environment): Promise<void> {
  const config = getConfig();
  const languages = await promiseLanguages(config);
  const pages = await promisePages(config, environment, languages);

  console.log(pages);
  // const sitemap = await promiseGenerateSitemap(config, pages);
  // const translations = await promiseGenerateTranslations(config, languages);
}
