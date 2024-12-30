export interface AudioFile {
  id: string;
  name: string;
  buffer: AudioBuffer | null;
  isLoading: boolean;
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