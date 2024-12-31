import { Injectable, effect } from "@angular/core";
import { State, Action, StateContext, NgxsOnInit } from "@ngxs/store";
import { PlaybackService } from "../../../playback-controls/src/playback.service";
import * as Actions from "./player.actions";
import { isPlaying } from "./player.selectors";

export interface PlayerStateModel {
  isPlaying: boolean;
  playerReady: boolean;
  pitchAdjust: number;
}

const bandOnly = ['click', 'cue', 'guide'];

@State<PlayerStateModel>({
  name: "player",
  defaults: {
    isPlaying: false,
    playerReady: false,
    pitchAdjust: 0,
  },
})
@Injectable()
export class PlayerState implements NgxsOnInit {
  constructor(
    private playbackService: PlaybackService
  ) { }

  ngxsOnInit(ctx: StateContext<any>): void {
    effect(() => {
      const newState = {
        isPlaying: this.playbackService.isPlaying(),
        playerReady: this.playbackService.playerReady(),
      };
      console.log({ oldState: ctx.getState(), newState });
      ctx.patchState(newState);
    })

  }

  @Action(Actions.PlayTracks)
  async play(ctx: StateContext<PlayerStateModel>) {
    await this.playbackService.play();
    ctx.patchState({ isPlaying: this.playbackService.isPlaying() });
  }

  @Action(Actions.PauseTracks)
  pause(ctx: StateContext<PlayerStateModel>) {
    this.playbackService.pause();
    ctx.patchState({ isPlaying: this.playbackService.isPlaying() });
  }

  @Action(Actions.TogglePlayback)
  togglePlayback(ctx: StateContext<PlayerStateModel>) {
    const { isPlaying } = ctx.getState();
    if (isPlaying) {
      this.playbackService.pause();
    } else {
      this.playbackService.play();
    }
    ctx.patchState({ isPlaying: this.playbackService.isPlaying() });
  }
}
