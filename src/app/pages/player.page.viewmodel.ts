import { createModelSelector } from "@ngxs/store";
import { getAllPresets } from "../../../libs/state/src/presets/preset.selectors";
import { getApplicablePreset } from "../selectors/tracks.selectors";

import { isPlaying, playerReady, tracks } from "../../../libs/state";
import { hasFocusedTracks } from "../selectors/tracks.selectors";

export const getViewModel = createModelSelector({
  tracks,
  playerReady,
  isPlaying,
  hasFocusedTracks,
  presets: getAllPresets,
  currentPreset: getApplicablePreset,
});
