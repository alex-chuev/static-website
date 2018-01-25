export class PathHelpers {

  static removeExtension(filePath: string): string {
    return filePath.slice(0, filePath.lastIndexOf('.'));
  }

  static getExtension(filePath: string): string {
    return filePath.slice(filePath.lastIndexOf('.') + 1);
  }

}
