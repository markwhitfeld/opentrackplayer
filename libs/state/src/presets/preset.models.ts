export interface Preset {
  name: string;
  bandTrack: TrackConfig;
  instrumentsTrack: TrackConfig;
  focusedTrack: TrackConfig;
}

export type TrackGroup = "bandTrack" | "instrumentsTrack" | "focusedTrack";

export interface TrackConfig {
  volume: number;
  pan: number;
}
