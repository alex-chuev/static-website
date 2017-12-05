import { Codes } from './codes';
import { TemplateHelpers } from './template-helpers';
import { Language } from '../entities/language';

export type PagesCompilerData = Codes & TemplateHelpers & {
  language: Language,
};
