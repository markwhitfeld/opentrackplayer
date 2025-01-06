import { createPropertySelectors, createSelector } from "@ngxs/store";
import { PresetStateModel, PresetState } from "./presets.state";

export const {
  defaultPreset: getDefaultPreset,
  presets: getPresets,
  currentPresetName: getCurrentPresetName,
} = createPropertySelectors<PresetStateModel>(PresetState);

export const currentPreset = createSelector(
  [getPresets, getCurrentPresetName],
  (presets, currentPresetName) =>
    presets.find((item) => item.name === currentPresetName)
);
