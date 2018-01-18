import { App } from '../../entities/app';
import { AppConfig } from '../../entities/app-config';
import { watch } from '../../serve/watch';
import { serve } from '../../serve/serve';

export function serveCommand() {
  const environment = {
    production: false,
  };
  const app = new App(new AppConfig(), environment);
  app.build();
  serve(app);
  watch(app);
}
