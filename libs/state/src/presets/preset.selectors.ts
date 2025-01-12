import { createPropertySelectors, createSelector } from "@ngxs/store";
import { PresetStateModel, PresetState } from "./presets.state";

export const {
  defaultPreset: getDefaultPreset,
  presets: getPresets,
  selectedPresetName: getSelectedPresetName,
  bandOnlyTrackNames: getBandOnlyTrackNames,
} = createPropertySelectors<PresetStateModel>(PresetState);

export const getSelectedPreset = createSelector(
  [getPresets, getSelectedPresetName, getDefaultPreset],
  (presets, selectedPresetName, defaultPreset) =>
    presets.find((item) => item.name === selectedPresetName) ?? defaultPreset
);
