import * as path from 'path';
import { defaultOptions } from '../../default-options';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { Options } from '../../interfaces/options';
import { outputJsonSync } from 'fs-extra';
import { parseLanguages } from './parse-languages';
import { CreateAnswers } from '../commands/answers/create';

interface Data {
  dir: string;
  src: string;
}

export function generate(answers: CreateAnswers, data: Data) {
  const options: Options = createOptions(answers, data);

  createConfigFile(answers, data, options);
  createLanguageFiles(answers, data, options);
  createPageFiles(answers, data, options);
  createIndexScriptFile(answers, data, options);
  createIndexStyleFile(answers, data, options);
}

function createOptions(answers: CreateAnswers, data: Data): Options {
  const options: Options = _.defaultsDeep({}, defaultOptions);

  options.translations.defaultLanguage = answers.defaultLanguage;
  options.pages.extension = answers.pagesExtension;
  options.styles.extension = answers.stylesExtension;
  options.scripts.extension = answers.scriptsExtension;
  options.src.folder = data.src;

  return options;
}

function createConfigFile(answers: CreateAnswers, data: Data, options: Options) {
  outputJsonSync(path.join(data.dir, 'static-website.json'), options, {
    spaces: 2,
  });
}

function createLanguageFiles(answers: CreateAnswers, data: Data, options: Options) {
  const languages = parseLanguages(answers.languages);

  languages.forEach(language => {
    const languagePath = path.join(data.dir, options.src.folder, options.translations.folder, `${language}.json`);

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

function createPageFiles(answers: CreateAnswers, data: Data, options: Options) {
  const pagePath = path.join(data.dir, options.src.folder, options.pages.folder, `index.${options.pages.extension}`);
  const layoutPath = path.join(data.dir, options.src.folder, 'layouts', `main.${options.pages.extension}`);

  fs.outputFileSync(pagePath, `extends ../layouts/main

block head
  title #{meta.title}
  meta(name="description" content=meta.description)
  meta(name="keywords" content=meta.keywords)

block content
  .title #{content}
`, 'utf-8');

  fs.outputFileSync(layoutPath, `html(lang=language)
  head
    meta(charset="utf-8")
    block head

    each url in css.external
      link(rel="stylesheet" type="text/css" href=url)

    each code in css.inline
      style(type="text/css")=code
  body
    block content
    block scripts

    each url in js.external
      script(type="text/javascript" src=url)

    each code in js.inline
      script(type="text/javascript")=code
`, 'utf-8');
}

function createIndexScriptFile(answers: CreateAnswers, data: Data, options: Options) {
  const file = path.join(data.dir, options.src.folder, options.scripts.folder, `index.${options.scripts.extension}`);

  fs.outputFileSync(file, '');
}

function createIndexStyleFile(answers: CreateAnswers, data: Data, options: Options) {
  const file = path.join(data.dir, options.src.folder, options.styles.folder, `index.${options.styles.extension}`);

  fs.outputFileSync(file, '');
}
