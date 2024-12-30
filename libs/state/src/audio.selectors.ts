import { createPropertySelectors } from '@ngxs/store';
import { AudioStateModel, AudioState } from './audio.state';

export const {
  tracks,
  isPlaying,
  currentTime
} = createPropertySelectors<AudioStateModel>(AudioState);