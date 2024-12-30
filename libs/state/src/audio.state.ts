import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import { AudioFile } from "../../audio-core";
import { FileRef, FileService } from "../../file-management/src/file.service";
import { PlaybackService } from "../../playback-controls/src/playback.service";
import { AudioService } from "../../audio-core";
import * as Actions from "./audio.actions";
import { patch, updateItem } from "@ngxs/store/operators";

export interface AudioTrack {
  fileRef: FileRef;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
}

export interface AudioStateModel {
  tracks: AudioTrack[];
  isPlaying: boolean;
  currentTime: number;
}

@State<AudioStateModel>({
  name: "audio",
  defaults: {
    tracks: [],
    isPlaying: false,
    currentTime: 0,
  },
})
@Injectable()
export class AudioState {
  constructor(
    private audioService: AudioService,
    private fileService: FileService,
    private playbackService: PlaybackService
  ) {}

  @Action(Actions.LoadFolder)
  async loadFolder(
    ctx: StateContext<AudioStateModel>,
    action: Actions.LoadFolder
  ) {
    const fileRefs = await this.fileService.getAudioFiles(action.dirHandle);
    const loadPromises: Promise<void>[] = [];
    const tracks = fileRefs.map<AudioTrack>((fileRef) => {
      return {
        fileRef,
        muted: false,
        pan: 0,
        soloed: false,
        volume: 100,
      };
    });
    ctx.patchState({ tracks });

    await Promise.all(
      fileRefs.map((file) =>
        this.fileService.getLoadedFileRef(file.id).then((ref) => {
          if (ref) {
            ctx.dispatch(new Actions.UpdateTrackFile(ref));
          }
        })
      )
      // fileRefs.map(file => this.audioService.loadAudioFile(file))
    );
  }

  @Action(Actions.UpdateTrackFile)
  async updateTrackFile(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackFile
  ) {
    const fileRef = action.fileRef;
    ctx.setState(
      patch({
        tracks: updateItem(
          (track) => track.fileRef.id === fileRef.id,
          patch({ fileRef })
        ),
      })
    );
  }

  @Action(Actions.PlayTracks)
  async play(ctx: StateContext<AudioStateModel>) {
    const state = ctx.getState();
    await this.playbackService.play(state.tracks);
    ctx.patchState({ isPlaying: true });
  }

  @Action(Actions.PauseTracks)
  pause(ctx: StateContext<AudioStateModel>) {
    this.playbackService.pause();
    ctx.patchState({ isPlaying: false });
  }

  @Action(Actions.UpdateTrackVolume)
  updateVolume(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackVolume
  ) {
    const state = ctx.getState();
    const tracks = state.tracks.map((track) =>
      track.id === action.trackId ? { ...track, volume: action.volume } : track
    );
    ctx.patchState({ tracks });
  }

  @Action(Actions.UpdateTrackPan)
  updatePan(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackPan
  ) {
    const state = ctx.getState();
    const tracks = state.tracks.map((track) =>
      track.id === action.trackId ? { ...track, pan: action.pan } : track
    );
    ctx.patchState({ tracks });
  }
}
