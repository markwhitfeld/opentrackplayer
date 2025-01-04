import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import { FileRef, FileService } from "../../../file-management/src/file.service";
import { PlaybackService } from "../../../playback-controls/src/playback.service";
import * as Actions from "./audio.actions";
import { StateOperator, patch, updateItem } from "@ngxs/store/operators";
import { PauseTracks } from "../player/player.actions";

export interface AudioTrack {
  id: string;
  fileRef: FileRef;
  volume: number;
  pan: number;
  muted: boolean;
  focused: boolean;
}

export interface AudioStateModel {
  trackMap: Record<string, AudioTrack>;
}

const bandOnly = ['click', 'cue', 'guide'];

@State<AudioStateModel>({
  name: "audio",
  defaults: {
    trackMap: {},
  },
})
@Injectable()
export class AudioState {
  constructor(
    private fileService: FileService,
    private playbackService: PlaybackService
  ) {}

  @Action(Actions.LoadFolder)
  async loadFolder(
    ctx: StateContext<AudioStateModel>,
    action: Actions.LoadFolder
  ) {
    const fileRefs = await this.fileService.getAudioFiles(action.dirHandle);
    const tracks = fileRefs.map<AudioTrack>((fileRef) => {
      const name = fileRef.name.toLocaleLowerCase();
      const pan = bandOnly.some(text => name.includes(text)) ? -1 : 1;
      return {
        id: fileRef.id,
        fileRef,
        muted: false,
        pan,
        focused: false,
        volume: 1,
      };
    });
    const trackMap: Record<string, AudioTrack> = {};
    tracks.forEach((item) => {
      trackMap[item.fileRef.id] = item;
    });
    ctx.patchState({ trackMap });

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
    await ctx.dispatch(new PauseTracks());
    await this.playbackService.load(tracks);
  }

  @Action(Actions.UpdateTrackFile)
  async updateTrackFile(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackFile
  ) {
    const fileRef = action.fileRef;
    ctx.setState(
      patchTrack(fileRef.id, patch({ fileRef }))
    );
  }

  @Action(Actions.UpdateTrackVolume)
  async updateVolume(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackVolume
  ) {
    const volume = action.volume;
    const trackId = action.trackId;
    ctx.setState(
      patchTrack(trackId, patch({ volume }))
    );
  }

  @Action(Actions.UpdateTrackPan)
  async updatePan(
    ctx: StateContext<AudioStateModel>,
    action: Actions.UpdateTrackPan
  ) {
    const pan = action.pan;
    const trackId = action.trackId;
    ctx.setState(
      patchTrack(trackId, patch({ pan }))
    );
  }

  @Action(Actions.ToggleTrackMute)
  async toggleTrackMute(
    ctx: StateContext<AudioStateModel>,
    action: Actions.ToggleTrackMute
  ) {
    const trackId = action.trackId;
    ctx.setState(
      patchTrack(trackId, patch({ muted: invertBoolean() }))
    );
  }

  @Action(Actions.ToggleTrackFocused)
  async toggleTrackSolo(
    ctx: StateContext<AudioStateModel>,
    action: Actions.ToggleTrackFocused
  ) {
    const trackId = action.trackId;
    ctx.setState(
      patchTrack(trackId, patch({ focused: invertBoolean() }))
    );
  }
}

function invertBoolean(): StateOperator<boolean> {
  return (val) => !val;
}

function patchTrack(
  id: string,
  op: StateOperator<AudioTrack>
): StateOperator<AudioStateModel> {
  return patch({
    trackMap: patch({
      [id]: op,
    }),
  });
}
