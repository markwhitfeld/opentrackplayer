import { createPropertySelectors, createSelector } from '@ngxs/store';
import { PlayerStateModel, PlayerState } from './player.state';

export const {
  isPlaying,
  playerReady,
} = createPropertySelectors<PlayerStateModel>(PlayerState);
