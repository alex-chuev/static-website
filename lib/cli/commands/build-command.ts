import { createApp } from '../../tasks/app';

export function buildCommand() {
  createApp({production: true}).build();
}
