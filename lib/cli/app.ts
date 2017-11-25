#!/usr/bin/env node

import * as program from 'commander';
import * as inquirer from 'inquirer';
import { initQuestions } from './commands/questions/init-questions';
import { init } from './commands/init';
import { build } from './commands/build';
import { createQuestions } from './commands/questions/create-questions';
import { create } from './commands/create';
import { CreateAnswers } from './commands/answers/create';
import { InitAnswers } from './commands/answers/init';

program
  .version('1.0.0')
  .description('Static website generator')
  .option('-c, --config [path]', 'path to the config file');

program
  .command('new <dir>')
  .description('to create a new project')
  .action(dir => inquirer.prompt(createQuestions).then((answers: CreateAnswers) => create(dir, answers)));

program
  .command('init')
  .description('to init a new static website in the existing project')
  .action(command => inquirer.prompt(initQuestions).then((answers: InitAnswers) => init(answers)));

program
  .command('build')
  .description('to build the project')
  .action(command => build(command));

program.parse(process.argv);
