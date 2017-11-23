#!/usr/bin/env node

import * as program from 'commander';
import * as inquirer from 'inquirer';
import { initQuestions } from './init-questions';
import { render } from '../render';
import { loadOptions } from './load-options';

program
  .version('1.0.0')
  .description('Static website generator')
  .option('-c, --config [path]', 'path to the config file');

program
  .command('init')
  .description('to init a new project')
  .action(() => inquirer.prompt(initQuestions).then(answers => {
    console.log(answers);
  }));

program
  .command('build')
  .description('to build the project')
  .action(command => render(loadOptions(command)));

program.parse(process.argv);
