import * as File from 'vinyl';
import { Readable } from 'stream';

export class StreamArray extends Readable {
  constructor(files: File[]) {
    super({
      objectMode: true,
    });

    files.forEach(file => this.push(file));

    this.push(null);
  }
}
