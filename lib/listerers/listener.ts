import { App } from '../entities/app';

export abstract class Listener {

  constructor(public app: App) {
  }

  abstract test(absolutePath: string): boolean;

  abstract add(absolutePath: string): void;

  abstract change(absolutePath: string): void;

  abstract unlink(absolutePath: string): void;

}
