import { Injectable, signal } from '@angular/core';
import { AudioTrack } from './models';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly audioContext = new AudioContext();
  private tracks = signal<AudioTrack[]>([]);

  async loadAudioFile(file: File): Promise<AudioTrack> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const track: AudioTrack = {
      id: crypto.randomUUID(),
      name: file.name,
      buffer: audioBuffer,
      volume: 1,
      pan: 0,
      muted: false,
      soloed: false
    };

    this.tracks.update(tracks => [...tracks, track]);
    return track;
  }
}