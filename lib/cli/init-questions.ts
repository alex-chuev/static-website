import { Answers, ChoiceType, Questions } from 'inquirer';

export const initQuestions: Questions = [
  {
    name: 'languages',
    message: 'Enter languages separated by commas or spaces:',
    type: 'input',
    default: 'en ru',
  },
  {
    name: 'language',
    message: 'Select the default language:',
    type: 'list',
    choices: (answers: Answers): ChoiceType[] => {
      const languages: string = answers['languages'];

      return languages.split(/[ ,]/);
    },
  },
  {
    name: 'css',
    message: 'Select a CSS preprocessor:',
    type: 'list',
    choices: [
      {
        name: 'Stylus',
        value: 'styl',
      },
      {
        name: 'Less',
        value: 'less',
      },
      {
        name: 'None',
        value: '',
      },
    ],
  },
  {
    name: 'javascript',
    message: 'Select a JavaScript preprocessor:',
    type: 'list',
    choices: [
      {
        name: 'TypeScript',
        value: 'ts',
      },
      {
        name: 'CoffeeScript',
        value: 'coffee',
      },
      {
        name: 'None',
        value: '',
      },
    ],
  },
];
