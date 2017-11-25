import { Answers, ChoiceType, Questions } from 'inquirer';
import { parseLanguages } from '../../utls/parse-languages';

export const initQuestions: Questions = [
  {
    name: 'srcFolder',
    message: 'Enter the source folder:',
    type: 'input',
    default: 'static',
  },
  {
    name: 'languages',
    message: 'Enter languages separated by commas or spaces:',
    type: 'input',
    default: 'en ru',
  },
  {
    name: 'defaultLanguage',
    message: 'Select the default language:',
    type: 'list',
    choices: (answers: Answers): ChoiceType[] => parseLanguages(answers['languages']),
  },
  {
    name: 'pagesExtension',
    message: 'Select a template engine:',
    type: 'list',
    choices: ['pug'],
  },
  {
    name: 'stylesExtension',
    message: 'Select a CSS preprocessor:',
    type: 'list',
    choices: ['styl'],
  },
  {
    name: 'scriptsExtension',
    message: 'Select a JavaScript preprocessor:',
    type: 'list',
    choices: ['ts'],
  },
];
