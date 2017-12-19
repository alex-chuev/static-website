import { Environment } from '../interfaces/environment';
import { promiseLanguages } from './languages';
import { getConfig } from './config';
import { promiseCompilePages } from './pages';
import { generateSitemap } from './sitemap';
import { updateTranslations } from './translations';

export async function build(environment: Environment): Promise<void> {
  const config = getConfig();
  const languages = await promiseLanguages(config);
  await promiseCompilePages(config, environment, languages);
  generateSitemap(config);
  updateTranslations(config, languages);
}
