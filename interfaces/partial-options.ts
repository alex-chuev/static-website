import { Options } from './options';

export type PartialOptions = {
  [P in keyof Options]?: Options[P];
}
