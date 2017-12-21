import { build } from '../../tasks/build';
import { createApp } from '../../tasks/app';

export function buildCommand() {
  const app = createApp({
    production: true,
  });

  build(app);
}
