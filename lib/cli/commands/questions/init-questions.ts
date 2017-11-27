import { Questions } from 'inquirer';
import { createQuestions } from './create-questions';

export const initQuestions: Questions = [].concat([
  {
    name: 'srcFolder',
    message: 'Enter the source folder:',
    type: 'input',
    default: 'src',
  },
], createQuestions);
