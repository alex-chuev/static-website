import { parseLanguages } from '../utls/parse-languages';
import { saveJson } from '../../utils/save-json';
import * as path from 'path';
import { defaultOptions } from '../../default-options';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { Options } from '../../interfaces/options';

interface Answers {
  [key: string]: any;
}

export function init(answers: Answers) {
  const options: Options = createOptions(answers);

  createConfigFile(options);
  createLanguageFiles(answers, options);
  createPageFiles(answers, options);
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
  saveJson('static-website.json', options);
}

function createLanguageFiles(answers: Answers, options: Options) {
  const languages = parseLanguages(answers['languages']);

  languages.forEach(language => {
    const languagePath = path.join(options.src.folder, options.translations.folder, `${language}.json`);
    saveJson(languagePath, {meta: {title: 'static-website', description: '', keywords: ''}, content: 'static-website'});
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

    if css.externalUrl
      link(rel="stylesheet" type="text/css" href=css.externalUrl)

    if css.inline
      style(type="text/css")=css.inline
  body
    block content
    block scripts

  if js.externalUrl
    script(type="text/javascript" src=js.externalUrl)

  if js.inline
    script(type="text/javascript")=js.inline
`, 'utf-8');
}
