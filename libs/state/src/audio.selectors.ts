import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AudioStateModel, AudioState } from './audio.state';

export const {
  trackMap,
  isPlaying,
  currentTime
} = createPropertySelectors<AudioStateModel>(AudioState);

export const tracks = createSelector([trackMap], (map) => Object.values(map));