import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AudioStateModel, AudioState } from './audio.state';

export const {
  trackMap,
} = createPropertySelectors<AudioStateModel>(AudioState);

export const tracks = createSelector([trackMap], (map) => Object.values(map));