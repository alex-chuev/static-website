export interface TemplateHelpers {
  currentUrl: string;
  i18n(page: string): string;
  url(page: string): string;
  isActiveUrl(page: string): boolean;
  languageUrl(language: string): string;
  link(page: string): string;
  languageLink(page: string): string;
  asset(page: string): string;
}
