import { App } from '../../entities/app/app';
import { AppConfig } from '../../entities/app/app-config';
import { watch } from '../../serve/watch';
import { serve } from '../../serve/serve';

export function serveCommand() {
  const app = new App(new AppConfig(false));
  app.build();
  serve(app);
  watch(app);
}
