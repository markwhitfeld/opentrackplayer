import { Injectable, signal } from '@angular/core';
import { AudioTrack } from '../../audio-core';

@Injectable({
  providedIn: 'root',
})
export class PlaybackService {
  private readonly audioContext = new AudioContext();
  private sourceNodes = new Map<string, AudioBufferSourceNode>();

  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);

  async play(tracks: AudioTrack[]) {
    if (this.isPlaying()) {
      return;
    }

    await this.audioContext.resume();
    //https://github.com/cwilso/Audio-Input-Effects/tree/main
    tracks.forEach((track) => {
      if (this.sourceNodes.get(track.id)) {
        return;
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = track.buffer;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = track.volume;

      const panNode = this.audioContext.createStereoPanner();
      panNode.pan.value = track.pan;

      source
        .connect(gainNode)
        .connect(panNode)
        .connect(this.audioContext.destination);

      source.start(0);
      this.sourceNodes.set(track.id, source);
    });

    this.isPlaying.set(true);
    this.updateTime();
  }

  pause() {
    this.audioContext.suspend();
    this.isPlaying.set(false);
  }

  private updateTime() {
    if (!this.isPlaying()) return;

    this.currentTime.set(this.audioContext.currentTime);
    requestAnimationFrame(() => this.updateTime());
  }
}
