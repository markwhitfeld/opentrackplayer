import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { AudioTrack } from '../../audio-core';
import { FileService } from '../../file-management/src/file.service';
import { PlaybackService } from '../../playback-controls/src/playback.service';
import { AudioService } from '../../audio-core';
import * as Actions from './audio.actions';

export interface AudioStateModel {
  tracks: AudioTrack[];
  isPlaying: boolean;
  currentTime: number;
}

@State<AudioStateModel>({
  name: 'audio',
  defaults: {
    tracks: [],
    isPlaying: false,
    currentTime: 0
  }
})
@Injectable()
export class AudioState {
  constructor(
    private audioService: AudioService,
    private fileService: FileService,
    private playbackService: PlaybackService
  ) {}

  @Action(Actions.LoadFolder)
  async loadFolder(ctx: StateContext<AudioStateModel>, action: Actions.LoadFolder) {
    const files = await this.fileService.getAudioFiles(action.dirHandle);
    const tracks = await Promise.all(
      files.map(file => this.audioService.loadAudioFile(file))
    );
    
    ctx.patchState({ tracks });
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
  updateVolume(ctx: StateContext<AudioStateModel>, action: Actions.UpdateTrackVolume) {
    const state = ctx.getState();
    const tracks = state.tracks.map(track => 
      track.id === action.trackId 
        ? { ...track, volume: action.volume }
        : track
    );
    ctx.patchState({ tracks });
  }

  @Action(Actions.UpdateTrackPan)
  updatePan(ctx: StateContext<AudioStateModel>, action: Actions.UpdateTrackPan) {
    const state = ctx.getState();
    const tracks = state.tracks.map(track => 
      track.id === action.trackId 
        ? { ...track, pan: action.pan }
        : track
    );
    ctx.patchState({ tracks });
  }
}