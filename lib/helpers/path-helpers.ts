const removeExtensionRegExp = /\.[^/\\.]+$/;

export function removeExtension(filepath: string): string {
  return filepath.replace(removeExtensionRegExp, '');
}
