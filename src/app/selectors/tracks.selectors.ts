import { createSelector } from "@ngxs/store";
import {
  getSelectedPreset,
  getDefaultPreset,
  getBandOnlyTrackNames,
} from "../../../libs/state/src/presets/preset.selectors";
import { AudioTrack, tracks } from "../../../libs/state";
import { TrackConfig } from "../../../libs/playback-controls/src/playback.service";
import { Preset } from "../../../libs/state/src/presets/preset.models";

export const hasFocusedTracks = createSelector([tracks], (tracks) => {
  const hasFocused = tracks.some((track) => track.focused);
  return hasFocused;
});

export const getApplicablePreset = createSelector(
  [getSelectedPreset, getDefaultPreset, hasFocusedTracks],
  (selectedPreset, defaultPreset, hasFocusedTracks) =>
    hasFocusedTracks ? selectedPreset : defaultPreset
);

export const getTrackGroupConfigFn = createSelector(
  [getBandOnlyTrackNames],
  (bandOnlyTrackNames) => (preset: Preset, track: AudioTrack) => {
    return track.focused
      ? preset.focusedTrack
      : bandOnlyTrackNames.some((text) => track.name.includes(text))
      ? preset.bandTrack
      : preset.instrumentsTrack;
  }
);

export const getTrackConfigs = createSelector(
  [tracks, getApplicablePreset, getTrackGroupConfigFn],
  (tracks, applicablePreset, getTrackGroupConfig) => {
    return tracks.map<TrackConfig>((track) => {
      const muteModifier = track.muted ? 0 : 1;
      const trackGroupConfig = getTrackGroupConfig(applicablePreset, track);
      return {
        trackId: track.id,
        gain: track.volume * muteModifier * trackGroupConfig.volume,
        pan: track.pan ?? trackGroupConfig.pan,
      };
    });
  }
);
