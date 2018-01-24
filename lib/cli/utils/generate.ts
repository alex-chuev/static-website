import * as path from 'path';
import { copySync, outputJsonSync } from 'fs-extra';
import { parseLanguages } from './parse-languages';
import { CreateAnswers } from '../interfaces/create-answers';
import { AppConfigDefaults } from '../../entities/app/app-config-defaults';

export function generate(answers: CreateAnswers, dir: string) {
  const configData = getConfigData(answers);

  createConfigFile(dir, configData);
  copyTemplate(dir);
  createLanguageFiles(answers, dir, configData);
}

function getConfigData(answers: CreateAnswers): AppConfigDefaults {
  return new AppConfigDefaults({
    translations: {
      defaultLanguage: answers.defaultLanguage,
    },
    pages: {
      extension: answers.pagesExtension,
    },
    styles: {
      extension: answers.stylesExtension,
    },
    scripts: {
      extension: answers.scriptsExtension,
    },
  });
}

function createConfigFile(dir: string, configData: AppConfigDefaults) {
  outputJsonSync(path.join(dir, 'static-website.json'), configData, {
    spaces: 2,
  });
}

function copyTemplate(dir: string) {
  copySync(path.join(__dirname, '../../../templates/basic'), dir);
}

function createLanguageFiles(answers: CreateAnswers, dir: string, config: AppConfigDefaults) {
  parseLanguages(answers.languages).forEach(language => {
    const languagePath = path.join(dir, 'src', config.translations.folder, `${language}.json`);

    outputJsonSync(languagePath, {
      meta: {
        title: `Static website (${language})`,
        description: '',
        keywords: '',
      },
      content: `Static website (${language})`,
    }, {
      spaces: 2,
    });
  });
}
