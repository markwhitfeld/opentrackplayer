import { Injectable, signal } from '@angular/core';
import { AudioFile } from './models';
import { FileRef } from '../../file-management/src/file.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  
  // private get audioContext() {
  //   return getAudioContext();
  // }

  // private audioFiles = new Map<string, AudioFile>

  // async loadAudioFile(file: FileRef): Promise<AudioFile> {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
  //   const track: AudioFile = {
  //     id: crypto.randomUUID(),
  //     name: file.name,
  //     buffer: audioBuffer,
  //     volume: 1,
  //     pan: 0,
  //     muted: false,
  //     soloed: false
  //   };

  //   this.tracks.update(tracks => [...tracks, track]);
  //   return track;
  // }
}