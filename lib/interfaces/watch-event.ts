import { WatchAction } from '../enums/watch-action';

export interface WatchEvent {
  action: WatchAction;
  absolutePath: string;
}
