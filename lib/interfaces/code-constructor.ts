import { Code } from '../entities/code';
import { CodeParams } from './code-params';

export interface CodeConstructor {
  new (params: CodeParams): Code;
}
