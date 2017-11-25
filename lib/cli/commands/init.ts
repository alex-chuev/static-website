import { parseLanguages } from '../utls/parse-languages';
import * as path from 'path';
import { defaultOptions } from '../../default-options';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { Options } from '../../interfaces/options';
import { outputJsonSync } from 'fs-extra';

interface Answers {
  [key: string]: any;
}

export function init(answers: Answers) {
  const options: Options = createOptions(answers);

  createConfigFile(options);
  createLanguageFiles(answers, options);
  createPageFiles(answers, options);
  createIndexScriptFile(options);
  createIndexStyleFile(options);
}

function createOptions(answers: Answers): Options {
  return _.defaultsDeep({
    src: {
      folder: answers['srcFolder'],
    },
    translations: {
      defaultLanguage: answers['defaultLanguage'],
    },
    pages: {
      extension: answers['pagesExtension'],
    },
    styles: {
      extension: answers['stylesExtension'],
    },
    scripts: {
      extension: answers['scriptsExtension'],
    },
  }, defaultOptions);
}

function createConfigFile(options: Options) {
  outputJsonSync('static-website.json', options, {
    spaces: 2,
  });
}

function createLanguageFiles(answers: Answers, options: Options) {
  const languages = parseLanguages(answers['languages']);

  languages.forEach(language => {
    const languagePath = path.join(options.src.folder, options.translations.folder, `${language}.json`);

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

function createPageFiles(answers: Answers, options: Options) {
  const pagePath = path.join(options.src.folder, options.pages.folder, `index.${options.pages.extension}`);
  const layoutPath = path.join(options.src.folder, 'layouts', `main.${options.pages.extension}`);

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

function createIndexScriptFile(options: Options) {
  const file = path.join(options.src.folder, options.scripts.folder, `index.${options.scripts.extension}`);

  fs.outputFileSync(file, '');
}

function createIndexStyleFile(options: Options) {
  const file = path.join(options.src.folder, options.styles.folder, `index.${options.styles.extension}`);

  fs.outputFileSync(file, '');
}
