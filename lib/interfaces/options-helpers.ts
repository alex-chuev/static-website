import { TemplateHelpers } from './template-helpers';

export type OptionsHelpers = {
  [A in keyof TemplateHelpers]: string;
};
