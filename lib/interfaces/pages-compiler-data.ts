import { Codes } from './codes';
import { TemplateHelpers } from './template-helpers';
import { Language } from '../entities/language';
import { Environment } from './environment';

export type PagesCompilerData = Codes & TemplateHelpers & {
  language: Language,
  environment: Environment,
};
