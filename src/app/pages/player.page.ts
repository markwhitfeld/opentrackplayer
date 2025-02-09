import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Store, dispatch, select } from "@ngxs/store";
import { TrackControlsComponent } from "../../../libs/shared-ui/src/components/track-controls.component";
import { FileService } from "../../../libs/file-management/src/file.service";
import * as AudioActions from "../../../libs/state/src/audio/audio.actions";
import * as PlayerActions from "../../../libs/state/src/player/player.actions";
import { CommonModule } from "@angular/common";
import {
  Preset,
  TrackGroup,
  trackGroupNames,
  trackGroups,
} from "../../../libs/state/src/presets/preset.models";
import * as PresetActions from "../../../libs/state/src/presets/preset.actions";
import { PresetControlsComponent } from "../../../libs/shared-ui/src/components/preset-controls.component";
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { getViewModel } from "./player.page.viewmodel";

@Component({
  selector: "app-player",
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TrackControlsComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    CommonModule,
    PresetControlsComponent,
  ],
  template: `
    <div class="player-container">
      <div class="controls">
        <button mat-raised-button color="primary" (click)="loadFolder()">
          <mat-icon>folder_open</mat-icon>
          Load Folder
        </button>

        <button
          mat-icon-button
          (click)="togglePlayback()"
          [disabled]="!viewModel().playerReady"
        >
          <mat-icon>{{
            viewModel().isPlaying ? "pause" : "play_arrow"
          }}</mat-icon>
        </button>
        <mat-progress-spinner
          mode="indeterminate"
          *ngIf="!viewModel().playerReady && viewModel().tracks.length"
          diameter="40"
        >
        </mat-progress-spinner>

        @if(viewModel().hasFocusedTracks){
        <mat-button-toggle-group
          [value]="viewModel().currentPreset.name"
          (change)="onPresetChange($event.value)"
          aria-label="Preset"
          [hideSingleSelectionIndicator]="true"
        >
          @for (preset of viewModel().presets; track $index) {
          <mat-button-toggle [value]="preset.name">{{
            preset.name
          }}</mat-button-toggle>
          }
        </mat-button-toggle-group>
        }
      </div>

      @if(viewModel().currentPreset; as preset) {
      <app-preset-controls [preset]="preset"></app-preset-controls>
      }

      <div class="tracks">
        @for (track of viewModel().tracks; track track.fileRef.id) {
        <app-track-controls
          [track]="track"
          (volumeChange)="updateVolume(track.id, $event)"
          (panChange)="updatePan(track.id, $event)"
          (muteToggle)="toggleMute(track.id)"
          (focusToggle)="toggleFocused(track.id)"
        />
        }
      </div>
    </div>
  `,
  styles: [
    `
      .player-container {
        padding: 1rem;
      }

      .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .tracks {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class PlayerPage {
  private store = inject(Store);
  private fileService = inject(FileService);

  trackGroups = trackGroups;
  trackGroupNames = trackGroupNames;
  viewModel = select(getViewModel);

  setCurrentPreset = dispatch(PresetActions.SetCurrentPreset);
  updatePreset = dispatch(PresetActions.UpdatePreset);
  updateVolume = dispatch(AudioActions.UpdateTrackVolume);
  updatePan = dispatch(AudioActions.UpdateTrackPan);
  toggleMute = dispatch(AudioActions.ToggleTrackMute);
  toggleFocused = dispatch(AudioActions.ToggleTrackFocused);

  onPresetChange(presetName: string) {
    this.setCurrentPreset(presetName);
  }

  changePresetVolume(preset: Preset, trackGroup: TrackGroup, volume: number) {
    this.updatePreset(preset.name, trackGroup, { volume });
  }

  changePresetPan(preset: Preset, trackGroup: TrackGroup, pan: number) {
    this.updatePreset(preset.name, trackGroup, { pan });
  }

  async loadFolder() {
    try {
      const dirHandle = await this.fileService.selectFolder();
      await this.store.dispatch(new AudioActions.LoadFolder(dirHandle));
    } catch (error) {
      console.error("Failed to load folder:", error);
    }
  }

  togglePlayback() {
    if (this.viewModel().isPlaying) {
      this.store.dispatch(new PlayerActions.PauseTracks());
    } else {
      this.store.dispatch(new PlayerActions.PlayTracks());
    }
  }
}
