import * as fs from 'fs-extra';
import * as path from 'path';
import { Options } from '../../interfaces/options';
import { defaultOptions } from '../../default-options';
import { readJsonSync } from 'fs-extra';

export function loadOptions(command: any): Options {
  if (command.parent.config) {
    const configPath = path.join(process.cwd(), command.parent.config);

    return load(configPath, true);
  } else {
    return load('static-website.json');
  }
}

function load(file: string, exit = false): Options {
  if (fs.existsSync(file)) {
    const options: Options = readJsonSync(file);

    return {
      ...defaultOptions,
      ...options,
    };
  } else if (exit) {
    console.error(`File ${file} doesn't exist`);
    process.exit(1);
  } else {
    return defaultOptions;
  }
}
