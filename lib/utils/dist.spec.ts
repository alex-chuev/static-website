import * as sinon from 'sinon';
import * as fs from 'fs-extra';
import { dist } from './dist';
import { defaultOptions } from '../default-options';
import { SinonSpy } from 'sinon';
import * as path from 'path';

let outputFileSyncSpy: SinonSpy;

describe('dist', function () {
  beforeEach(() => {
    outputFileSyncSpy = sinon.spy(fs, 'outputFileSync');
  });

  afterEach(() => {
    outputFileSyncSpy.restore();
  });

  it('should call fs.outputFileSync with the next arguments', function () {
    dist('index.html', 'data', defaultOptions);

    sinon.assert.calledWith(outputFileSyncSpy, `${defaultOptions.distFolder}${path.sep}index.html`, 'data', defaultOptions.distEncoding);
  });
});
