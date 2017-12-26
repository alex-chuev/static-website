import { AppConfig } from '../../entities/app-config';
import { App } from '../../entities/app';

export function buildCommand() {
  const config = new AppConfig();
  const environment = {
    production: true,
  };
  const app = new App(config, environment);
  app.build();
}
