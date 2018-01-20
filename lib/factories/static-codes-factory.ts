import { StaticCode } from '../entities/code/static-code';
import * as _ from 'lodash';
import * as glob from 'glob';
import { Style } from '../entities/code/style';
import { Script } from '../entities/code/script';
import { AppConfig } from '../entities/app/app-config';
import { StaticCodePathConfig } from '../interfaces/static-code-path';
import { FileObject } from '../entities/file-object';

export class StaticCodesFactory {

  static create(pathConfigs: StaticCodePathConfig[], config: AppConfig): StaticCode[] {
    return _.flatMap(pathConfigs, pathConfig => glob.sync(pathConfig.pattern)
      .map(filePath => new FileObject(filePath))
      .map(file => this.createSingle(file, pathConfig.root, config))
    );
  }

  static createSingle(file: FileObject, root: string, config: AppConfig): StaticCode {
    if (Style.test(file, config)) {
      return new Style(file, root, config);
    } else if (Script.test(file, config)) {
      return new Script(file, root, config);
    }
  }

}
