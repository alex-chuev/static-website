import { WatchAction } from '../enums/watch-action';
import { App } from '../app';

export interface WatchEvent {
  app: App;
  action: WatchAction;
  file: string;
}
