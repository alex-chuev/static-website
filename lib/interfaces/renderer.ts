import { Translation } from './translation';

export interface Renderer {
  (path: string, translation: Translation): string;
}
