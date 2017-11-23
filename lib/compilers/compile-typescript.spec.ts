import * as assert from 'assert';
import { compileTypescript } from './compile-typescript';
import { defaultOptions } from '../default-options';

describe('compileTypescript', function () {
  it('should compile typescript to javascript', function () {
    const source = `let data: string  = 'data'`;
    const compiled = `var data = 'data';\r\n`;

    assert.equal(compileTypescript(source, defaultOptions.scriptsCompilerOptions), compiled);
  });
});
