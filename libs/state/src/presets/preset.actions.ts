import { TrackConfig, TrackGroup } from "./preset.models";

export class UpdatePreset {
  static readonly type = '[Preset] Update preset';
  constructor(public name: string, public trackGroup: TrackGroup, public update: Partial<TrackConfig>) {}
}

export class UpdateDefaultPreset {
  static readonly type = '[Preset] Update default preset';
  constructor(public trackGroup: TrackGroup, public update: Partial<TrackConfig>) {}
}

export class SetCurrentPreset {
  static readonly type = '[Preset] Set current preset';
  constructor(public name: string) {}
}
