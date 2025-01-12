import { Component, input } from "@angular/core";
import { CommonModule } from "@angular/common";

import { createModelSelector, dispatch, select } from "@ngxs/store";
import { tracks, playerReady, isPlaying } from "../../../state";
import {
  Preset,
  trackGroups,
  trackGroupNames,
  TrackGroup,
} from "../../../state/src/presets/preset.models";
import {
  getPresets,
  getSelectedPreset,
} from "../../../state/src/presets/preset.selectors";
import { OutputControlsComponent } from "./output-controls.component";
import { UpdatePreset } from "../../../state/src/presets/preset.actions";

const getViewModel = createModelSelector({
  tracks,
  playerReady,
  isPlaying,
  getPresets,
  currentPreset: getSelectedPreset,
});

@Component({
  selector: "app-preset-controls",
  standalone: true,
  imports: [CommonModule, OutputControlsComponent],
  template: `
    <div class="presets-container">
      <div class="controls">
        <p>{{ preset().name }}</p>
        <div class="groups">
          @for(trackGroup of trackGroups; track trackGroup) {
          @if(preset()[trackGroup]; as trackConfig) {
          <div class="group">
            <span>{{ trackGroupNames[trackGroup] }}:</span>
            <app-output-controls
              [trackConfig]="trackConfig"
              [vertical]="true"
              (panChange)="changePresetPan(preset(), trackGroup, $event)"
              (volumeChange)="changePresetVolume(preset(), trackGroup, $event)"
            ></app-output-controls>
          </div>
          } }
        </div>
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
        flex-direction: column;
        gap: 0.5rem;
      }

      .groups {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class PresetControlsComponent {
  preset = input.required<Preset>();

  trackGroups = trackGroups;
  trackGroupNames = trackGroupNames;
  viewModel = select(getViewModel);

  updatePreset = dispatch(UpdatePreset);

  changePresetVolume(preset: Preset, trackGroup: TrackGroup, volume: number) {
    this.updatePreset(preset.name, trackGroup, { volume });
  }

  changePresetPan(preset: Preset, trackGroup: TrackGroup, pan: number) {
    this.updatePreset(preset.name, trackGroup, { pan });
  }
}
