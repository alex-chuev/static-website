import { Attributes } from './attributes';

export interface TemplateHelpers {
  currentUrl: string;
  i18n(page: string): string;
  url(page: string, language?: string): string;
  i18n(page: string, otherwise?: any): string;
  url(page: string): string;
  isActiveUrl(page: string): boolean;
  languageUrl(language: string): string;
  link(page: string, text?: string, className?: string, activeClass?: string, attributes?: Attributes, language?: string): string;
  languageLink(language: string, text?: string, className?: string, activeClass?: string, attributes?: Attributes): string;
  asset(page: string): string;
}
