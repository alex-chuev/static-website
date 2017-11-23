import * as sinon from 'sinon';
import * as fs from 'fs-extra';
import { dist } from './dist';
import { defaultOptions } from '../default-options';
import { SinonSpy } from 'sinon';
import * as path from 'path';
import * as assert from 'assert';

let outputFileSyncStub: SinonSpy;
let consoleLogStub: SinonSpy;

describe('dist', function () {
  beforeEach(() => {
    outputFileSyncStub = sinon.stub(fs, 'outputFileSync');
    consoleLogStub = sinon.stub(console, 'info');
  });

  afterEach(() => {
    outputFileSyncStub.restore();
    consoleLogStub.restore();
  });

  it('should call methods with the next arguments', function () {
    dist('index.html', 'data', defaultOptions);

    const filePath = `${defaultOptions.distFolder}${path.sep}index.html`;

    assert(outputFileSyncStub.calledWith(filePath, 'data', defaultOptions.distEncoding));
    assert(consoleLogStub.calledWith(`> ${filePath}`));
  });
});
