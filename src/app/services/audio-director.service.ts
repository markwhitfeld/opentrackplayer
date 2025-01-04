import { Injectable, effect, inject } from "@angular/core";
import { createSelector, select } from "@ngxs/store";
import { tracks } from "../../../libs/state";
import {
  PlaybackService,
  TrackConfig,
} from "../../../libs/playback-controls/src/playback.service";

const getTrackConfigs = createSelector([tracks], (tracks) => {
  const hasFocused = tracks.some((track) => track.focused);
  return tracks.map<TrackConfig>((track) => ({
    trackId: track.id,
    gain: track.muted ? 0 : hasFocused && !track.focused ? 0 : track.volume,
    pan: track.pan,
  }));
});

@Injectable({
  providedIn: "root",
})
export class AudioDirectorService {
  private player = inject(PlaybackService);
  private trackConfigs = select(getTrackConfigs);

  start() {
    console.log("Starting audio director");

    effect(() => {
      const trackConfigs = this.trackConfigs();
      this.player.syncTracks(trackConfigs);
    });
  }
}
