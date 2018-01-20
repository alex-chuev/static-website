const removeExtensionRegExp = /\.[^/\\.]+$/;

export class PathHelpers {

  static removeExtension(filePath: string): string {
    return filePath.replace(removeExtensionRegExp, '');
  }

  static getExtension(filePath: string): string {
    return filePath.slice(filePath.lastIndexOf('.') + 1);
  }

}
