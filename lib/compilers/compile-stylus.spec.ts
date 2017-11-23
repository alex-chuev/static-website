import { compileStylus } from './compile-stylus';
import * as assert from 'assert';

describe('compileStylus', function () {
  it('should compile stylus to css', function () {
    assert.equal(compileStylus(`.container\n\tcolor red`), '.container{color:#f00}');
  });
});
