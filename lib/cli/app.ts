import * as program from 'commander';
import * as inquirer from 'inquirer';
import { initQuestions } from './commands/questions/init-questions';
import { init } from './commands/init';
import { build } from './commands/build';

program
  .version('1.0.0')
  .description('Static website generator')
  .option('-c, --config [path]', 'path to the config file');

program
  .command('init')
  .description('to init a new project')
  .action(command => inquirer.prompt(initQuestions).then(answers => init(answers)));

program
  .command('build')
  .description('to build the project')
  .action(command => build(command));

program.parse(process.argv);
