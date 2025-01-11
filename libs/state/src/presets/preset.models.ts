export interface Preset {
  name: string;
  bandTrack: TrackConfig;
  instrumentsTrack: TrackConfig;
  focusedTrack: TrackConfig;
}

export const trackGroupNames : Record<TrackGroup,string> = {
  'bandTrack': 'Band',
  'instrumentsTrack': 'Instruments',
  'focusedTrack': 'Focused',
}
export const trackGroups = ["bandTrack", "instrumentsTrack", "focusedTrack"] as const;

export type TrackGroup = typeof trackGroups[number];

export interface TrackConfig {
  volume: number;
  pan: number;
}
