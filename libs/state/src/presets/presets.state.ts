import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import * as Actions from "./preset.actions";
import { StateOperator, patch, updateItem } from "@ngxs/store/operators";
import { Preset, TrackConfig, TrackGroup } from "./preset.models";

export interface PresetStateModel {
  bandOnlyTrackNames: string[];
  defaultPreset: Preset;
  presets: Preset[];
  selectedPresetName: string;
}

@State<PresetStateModel>({
  name: "presets",
  defaults: {
    bandOnlyTrackNames: ['click', 'cue', 'guide'],
    defaultPreset: {
      name: "Split",
      bandTrack: { volume: 0.75, pan: -1 },
      instrumentsTrack: { volume: 0.75, pan: 1 },
      focusedTrack: { volume: 0, pan: 0 },
    },
    presets: [
      {
        name: "Solo",
        bandTrack: { volume: 0, pan: -1 },
        instrumentsTrack: { volume: 0, pan: 1 },
        focusedTrack: { volume: 1, pan: 1 },
      },
      {
        name: "Practice",
        bandTrack: { volume: 0.75, pan: 0 },
        instrumentsTrack: { volume: 0.75, pan: 0 },
        focusedTrack: { volume: 1, pan: -1 },
      },
      {
        name: "Favourite",
        bandTrack: { volume: 0.75, pan: -1 },
        instrumentsTrack: { volume: 0.75, pan: 1 },
        focusedTrack: { volume: 1, pan: 0 },
      },
    ],
    selectedPresetName: "Practice",
  },
})
@Injectable()
export class PresetState {
  @Action(Actions.UpdatePreset)
  async updatePreset(
    ctx: StateContext<PresetStateModel>,
    action: Actions.UpdatePreset
  ) {
    ctx.setState(
      patchPreset(action.name, action.trackGroup, patch(action.update))
    );
  }

  @Action(Actions.UpdateDefaultPreset)
  async updateDefaultPreset(
    ctx: StateContext<PresetStateModel>,
    action: Actions.UpdateDefaultPreset
  ) {
    ctx.setState(
      patch({
        defaultPreset: patch({ [action.trackGroup]: patch(action.update) }),
      })
    );
  }

  @Action(Actions.SetCurrentPreset)
  async setCurrentPreset(
    ctx: StateContext<PresetStateModel>,
    action: Actions.SetCurrentPreset
  ) {
    ctx.setState(
      patch({
        selectedPresetName: action.name,
      })
    );
  }
}

function patchPreset(
  id: string,
  trackGroup: TrackGroup,
  op: StateOperator<TrackConfig>
): StateOperator<PresetStateModel> {
  return patch({
    presets: updateItem((item) => item.name == id, patch({ [trackGroup]: op })),
  });
}
