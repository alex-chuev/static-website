import * as assert from 'assert';
import { compilePug } from './compile-pug';

describe('compilePug', function () {
  it('should compile pug to html', function () {
    assert.equal(compilePug(`.container`), '<div class="container"></div>');
  });
});
