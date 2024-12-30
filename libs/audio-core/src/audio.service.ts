import { Injectable, signal } from '@angular/core';
import { AudioFile } from './models';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly audioContext = new AudioContext();
  private tracks = signal<AudioFile[]>([]);

  async loadAudioFile(file: File): Promise<AudioFile> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    const track: AudioFile = {
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