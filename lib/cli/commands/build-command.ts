import { App } from '../../entities/app/app';
import { AppConfig } from '../../entities/app/app-config';
import { Compiler } from '../../entities/compiler/compiler';

export function buildCommand() {
  const config = new AppConfig();
  const compiler = new Compiler(config);

  compiler.compile()
    .then(() => {
      const app = new App(config);
      app.build();
    });
}
