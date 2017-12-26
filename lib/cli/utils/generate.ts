import * as path from 'path';
import { copySync, outputJsonSync } from 'fs-extra';
import { parseLanguages } from './parse-languages';
import { CreateAnswers } from '../commands/answers/create';
import { ConfigDefaults } from '../../entities/config-defaults';

interface Params {
  dir: string;
  src: string;
}

export function generate(answers: CreateAnswers, params: Params) {
  const configData = getConfigData(answers, params);
  const target = path.join(params.dir, params.src);

  createConfigFile(params, configData);
  copyTemplate(target);
  createLanguageFiles(answers, target, configData);
}

function getConfigData(answers: CreateAnswers, params: Params): ConfigDefaults {
  return new ConfigDefaults({
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
    src: {
      folder: params.src,
    },
  });
}

function createConfigFile(params: Params, configData: ConfigDefaults) {
  outputJsonSync(path.join(params.dir, 'static-website.json'), configData, {
    spaces: 2,
  });
}

function copyTemplate(target: string) {
  copySync(path.join(__dirname, '../../../templates/basic'), target);
}

function createLanguageFiles(answers: CreateAnswers, target: string, config: ConfigDefaults) {
  parseLanguages(answers.languages).forEach(language => {
    const languagePath = path.join(target, config.translations.folder, `${language}.json`);

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
