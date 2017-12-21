import { build } from '../../tasks/build';
import { createBuildCache } from '../../tasks/cache';

export function buildCommand() {
  const cache = createBuildCache({
    production: true,
  });

  build(cache);
}
