import { Injectable, effect, inject } from "@angular/core";
import { select } from "@ngxs/store";
import {
  PlaybackService,
} from "../../../libs/playback-controls/src/playback.service";
import { getTrackConfigs } from "../selectors/tracks.selectors";

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
