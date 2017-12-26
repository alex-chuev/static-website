import { Environment } from './environment';
import { AppConfig } from '../entities/app-config';

export interface CodeParams {
  host: string;
  file: string;
  config: AppConfig;
  environment: Environment;
}
