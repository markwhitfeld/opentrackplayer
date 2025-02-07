import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import * as Actions from "./preset.actions";
import {
  StateOperator,
  append,
  compose,
  patch,
  updateItem,
} from "@ngxs/store/operators";
import { Preset, TrackConfig, TrackGroup } from "./preset.models";

export interface PresetStateModel {
  bandOnlyTrackNames: string[];
  defaultPreset: Preset;
  presets: Record<string, Preset>;
  selectedPresetName: string;
}

@State<PresetStateModel>({
  name: "presets",
  defaults: {
    bandOnlyTrackNames: ["click", "cue", "guide"],
    defaultPreset: {
      name: "Split",
      bandTrack: { volume: 0.75, pan: -1 },
      instrumentsTrack: { volume: 0.75, pan: 1 },
      focusedTrack: { volume: 0, pan: 0 },
    },
    presets: {
      Solo: {
        name: "Solo",
        bandTrack: { volume: 0, pan: -1 },
        instrumentsTrack: { volume: 0, pan: 1 },
        focusedTrack: { volume: 1, pan: 1 },
        fixedPreset: true,
      },
      Practice: {
        name: "Practice",
        bandTrack: { volume: 0.75, pan: 0 },
        instrumentsTrack: { volume: 0.75, pan: 0 },
        focusedTrack: { volume: 1, pan: -1 },
        fixedPreset: true,
      },
      Favourite: {
        name: "Favourite",
        bandTrack: { volume: 0.75, pan: -1 },
        instrumentsTrack: { volume: 0.75, pan: 1 },
        focusedTrack: { volume: 1, pan: 0 },
        fixedPreset: true,
      },
    },
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
    if (action.name === "Split") {
      return ctx.dispatch(
        new Actions.UpdateDefaultPreset(action.trackGroup, action.update)
      );
    }
    const preset = ctx.getState().presets[action.name];
    if (preset?.fixedPreset) {
      const newName = "Custom";
      const customPreset: Preset = {
        ...preset,
        fixedPreset: false,
        name: newName,
      };
      ctx.setState(
        compose(
          patch({
            presets: patch({ [newName]: customPreset }),
            selectedPresetName: newName,
          }),
          patchPreset(newName, action.trackGroup, patch(action.update))
        )
      );
    } else {
      ctx.setState(
        patchPreset(action.name, action.trackGroup, patch(action.update))
      );
    }
    return;
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
    presets: patch({
      [id]: patch({ [trackGroup]: op }),
    }),
  });
}
