import * as path from 'path';
import { defaultConfig } from '../../default-options';
import { copySync, outputJsonSync } from 'fs-extra';
import * as _ from 'lodash';
import { Config } from '../../interfaces/config';
import { parseLanguages } from '../utils/parse-languages';
import { FilePath } from '../../types';
import { CreateAnswers } from '../commands/answers/create';

interface Data {
  dir: string;
  src: string;
}

export function generate(answers: CreateAnswers, data: Data) {
  const options = getOptions(answers, data);
  const target = path.join(data.dir, data.src);

  createConfigFile(data, options);
  copyTemplate(target);
  createLanguageFiles(answers, target, options);
}

function getOptions(answers: CreateAnswers, data: Data): Config {
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

function createConfigFile(data: Data, options: Config) {
  outputJsonSync(path.join(data.dir, 'static-website.json'), options, {
    spaces: 2,
  });
}

function copyTemplate(target: FilePath) {
  copySync(path.join(__dirname, '../../../templates/basic'), target);
}

function createLanguageFiles(answers: CreateAnswers, target: FilePath, options: Config) {
  parseLanguages(answers.languages).forEach(language => {
    const languagePath = path.join(target, options.translations.folder, `${language}.json`);

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
