import * as fs from 'fs-extra';

export function saveJson(path: string, data: any) {
  fs.outputFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}
