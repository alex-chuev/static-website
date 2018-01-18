import { AppConfig } from '../entities/app-config';

export interface CodeParams {
  host: string;
  absolutePath: string;
  config: AppConfig;
}
