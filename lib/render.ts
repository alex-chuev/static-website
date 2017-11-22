import * as fs from 'fs-extra';

import { defaultOptions } from './default-options';
import { Options } from '../interfaces/options';
import { PartialOptions } from '../interfaces/partial-options';
import { renderPages } from './render-pages';

export function render(partialOptions?: PartialOptions) {
  const options = prepareOptions(partialOptions);

  if (options.cleanDistFolder) {
    cleanDistFolder(options);
  }

  renderPages(options);
}

function prepareOptions(partialOptions: PartialOptions): Options {
  if (partialOptions) {
    return {
      ...defaultOptions,
      ...partialOptions,
    };
  } else {
    return defaultOptions;
  }
}

function cleanDistFolder(options: Options) {
  fs.removeSync(options.distFolder);
}
