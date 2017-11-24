import * as fs from 'fs-extra';
import { PartialOptions } from '../../interfaces/partial-options';
import * as path from 'path';

export function loadOptions(command: any): PartialOptions {
  if (command.parent.config) {
    return load(path.join(process.cwd(), command.parent.config), true);
  } else {
    return load('static-website.json');
  }
}

function load(file: string, exit = false): PartialOptions {
  if (fs.existsSync(file)) {
    return parse(fs.readFileSync(file, 'utf-8'), file);
  } else if (exit) {
    console.error(`File ${file} doesn't exist`);
    process.exit(1);
  } else {
    return {};
  }
}

function parse(contents: string, file: string): PartialOptions {
  try {
    return JSON.parse(contents);
  }
  catch {
    console.error(`File ${file} isn't a valid JSON file`);
    process.exit(1);
  }
}
