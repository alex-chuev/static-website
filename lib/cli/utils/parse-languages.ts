const regexp = /[ ,]+/g;

export function parseLanguages(languages: string): string[] {
  return languages.split(regexp);
}
