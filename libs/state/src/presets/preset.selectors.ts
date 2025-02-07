import { createPropertySelectors, createSelector } from "@ngxs/store";
import { PresetStateModel, PresetState } from "./presets.state";

export const {
  defaultPreset: getDefaultPreset,
  presets: getPresets,
  selectedPresetName: getSelectedPresetName,
  bandOnlyTrackNames: getBandOnlyTrackNames,
} = createPropertySelectors<PresetStateModel>(PresetState);

export const getAllPresets = createSelector([getPresets], (presets) => [
  ...Object.values(presets),
]);

export const getSelectedPreset = createSelector(
  [getPresets, getSelectedPresetName],
  (presets, selectedPresetName) => presets[selectedPresetName]
);

export const getAppliedPreset = createSelector(
  [getSelectedPreset, getDefaultPreset],
  (selectedPreset, defaultPreset) => selectedPreset || defaultPreset
);
