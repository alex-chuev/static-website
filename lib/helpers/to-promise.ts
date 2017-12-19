import toArray = require('stream-to-array');
import ReadWriteStream = NodeJS.ReadWriteStream;

export function toPromise<T>(stream: ReadWriteStream): Promise<T> {
  return toArray(stream).then(data => data[0]);
}
