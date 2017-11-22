import * as pug from 'pug';

import { Renderer } from './interfaces/renderer';
import { Translation } from './interfaces/translation';

export const defaultRenderer: Renderer = (path: string, translation: Translation) => pug.renderFile(path, translation);
