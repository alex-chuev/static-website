#!/usr/bin/env node

import * as program from 'commander';
import * as inquirer from 'inquirer';
import { initQuestions } from './questions/init-questions';
import { initCommand } from './commands/init-command';
import { buildCommand } from './commands/build-command';
import { createQuestions } from './questions/create-questions';
import { newCommand } from './commands/new-command';
import { CreateAnswers } from './interfaces/create-answers';
import { InitAnswers } from './interfaces/init-answers';
import { serveCommand } from './commands/serve-command';
import { i18nCommand } from './commands/i18n-command';

program
  .version('1.0.0')
  .description('Static website generator')
  .option('-c, --config [path]', 'path to the config file');

program
  .command('new <dir>')
  .description('to create a new project')
  .action(dir => inquirer.prompt(createQuestions).then((answers: CreateAnswers) => newCommand(dir, answers)));

program
  .command('serve')
  .description('to serve the project')
  .action(command => serveCommand());

program
  .command('init')
  .description('to init a new static website in the existing project')
  .action(command => inquirer.prompt(initQuestions).then((answers: InitAnswers) => initCommand(answers)));

program
  .command('build')
  .description('to build the project')
  .action(command => buildCommand());

program
  .command('i18n <message> [value]')
  .description('to add a new message to all translation files')
  .action((message: string, value: string) => i18nCommand(message, value));

program.parse(process.argv);
