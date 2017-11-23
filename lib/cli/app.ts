#!/usr/bin/env node

import * as program from 'commander';
import * as inquirer from 'inquirer';
import { initQuestions } from './init-questions';

program
  .version('1.0.0')
  .description('Static website generator')
  .option('-c, --config', 'path to the config file');

program
  .command('init')
  .description('to init a new project')
  .action(() => inquirer.prompt(initQuestions).then(answers => {
    console.log(answers);
  }));

program
  .command('build')
  .description('to build the project')
  .action(() => {
    console.log('build');
  });

program.parse(process.argv);
