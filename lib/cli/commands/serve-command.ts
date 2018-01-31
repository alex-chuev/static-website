import { App } from '../../entities/app/app';
import { AppConfig } from '../../entities/app/app-config';
import { watch } from '../../serve/watch';
import { serve } from '../../serve/serve';
import { Compiler } from '../../entities/compiler/compiler';

export function serveCommand() {
  const config = new AppConfig(false);
  const compiler = new Compiler(config);

  compiler.compile()
    .then(() => {
      compiler.watch();

      const app = new App(config);
      app.build();

      serve(app);
      watch(app, compiler);
    });
}
