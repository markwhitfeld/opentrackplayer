export interface AudioTrack {
  id: string;
  name: string;
  buffer: AudioBuffer;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}