import { Environment } from '../interfaces/environment';
import { promiseLanguages } from './languages';
import { Config } from '../interfaces/config';
import { promiseCompilePages } from './pages';
import { generateSitemap } from './sitemap';
import { updateTranslations } from './translations';
import { emptyDirSync } from 'fs-extra';
import { copyAssets } from './assets';

export async function build(config: Config, environment: Environment): Promise<void> {
  if(config.dist.clean) {
    emptyDirSync(config.dist.folder);
  }

  const languages = await promiseLanguages(config);
  await promiseCompilePages(config, environment, languages);
  generateSitemap(config);
  updateTranslations(config, languages);
  copyAssets(config);
}
