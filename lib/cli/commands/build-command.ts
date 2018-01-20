import { App } from '../../entities/app/app';

export function buildCommand() {
  (new App()).build();
}
