import { App } from '../entities/app/app';
import { FileObject } from '../entities/file-object';

export abstract class Listener {

  constructor(public app: App) {
  }

  abstract test(file: FileObject): boolean;

  abstract add(file: FileObject): void;

  abstract change(file: FileObject): void;

  abstract unlink(file: FileObject): void;

}
