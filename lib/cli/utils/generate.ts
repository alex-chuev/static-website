import * as path from 'path';
import { defaultConfig } from '../../default-config';
import { copySync, outputJsonSync } from 'fs-extra';
import * as _ from 'lodash';
import { Config } from '../../interfaces/config';
import { parseLanguages } from './parse-languages';
import { FilePath } from '../../types';
import { CreateAnswers } from '../commands/answers/create';

interface Data {
  dir: string;
  src: string;
}

export function generate(answers: CreateAnswers, data: Data) {
  const config = getConfig(answers, data);
  const target = path.join(data.dir, data.src);

  createConfigFile(data, config);
  copyTemplate(target);
  createLanguageFiles(answers, target, config);
}

function getConfig(answers: CreateAnswers, data: Data): Config {
  return _.defaultsDeep({
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
      folder: data.src,
    },
  }, defaultConfig);
}

function createConfigFile(data: Data, config: Config) {
  outputJsonSync(path.join(data.dir, 'static-website.json'), config, {
    spaces: 2,
  });
}

function copyTemplate(target: FilePath) {
  copySync(path.join(__dirname, '../../../templates/basic'), target);
}

function createLanguageFiles(answers: CreateAnswers, target: FilePath, config: Config) {
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
