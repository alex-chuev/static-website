import * as stylus from 'stylus';

export function compileStylus(source: string, filename?: string): string {
  return stylus(source)
    .set('filename', filename)
    .set('compress', true)
    .render();
}
