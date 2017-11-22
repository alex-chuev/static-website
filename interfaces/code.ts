import { ExternalCode } from './external-code';

export interface Code {
  global?: string;
  inline?: string;
  external?: ExternalCode;
}
