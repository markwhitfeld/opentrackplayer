import { FileRef } from "../../../file-management/src/file.service";

export class LoadFolder {
  static readonly type = '[Audio] Load Folder';
  constructor(public dirHandle: FileSystemDirectoryHandle) {}
}

export class UpdateTrackFile {
  static readonly type = '[Audio] Update TrackFile';
  constructor(public fileRef: FileRef) {}
}

export class UpdateTrackVolume {
  static readonly type = '[Audio] Update Volume';
  constructor(public trackId: string, public volume: number) {}
}

export class UpdateTrackPan {
  static readonly type = '[Audio] Update Pan';
  constructor(public trackId: string, public pan: number) {}
}

export class ToggleTrackMute {
  static readonly type = '[Audio] Toggle Mute';
  constructor(public trackId: string) {}
}

export class ToggleTrackSolo {
  static readonly type = '[Audio] Toggle Solo';
  constructor(public trackId: string) {}
}