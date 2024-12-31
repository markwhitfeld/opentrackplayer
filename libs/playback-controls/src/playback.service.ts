import { Injectable, inject, signal } from "@angular/core";
import { AudioTrack } from "../../state";
import { FileRef, FileService } from "../../file-management/src/file.service";
import { lazy } from "./lazy";

interface AudioStream {
  id: string;
  audioBuffer: AudioBuffer;
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  panNode: StereoPannerNode;
  trackNode: AudioNode;
}

const getAudioContext = lazy(() => new AudioContext());

@Injectable({
  providedIn: "root",
})
export class PlaybackService {
  protected fileService = inject(FileService);

  private get audioContext() {
    return getAudioContext();
  }

  private audioStreams = new Map<string, AudioStream>();

  private offset = 0;
  private started = false;
  readonly isPlaying = signal(false);
  readonly playerReady = signal(false);

  async play() {
    if (this.isPlaying() || !this.playerReady()) {
      return;
    }
    await this.audioContext.resume();
    if (this.offset === 0 && !this.started) {      
      this.startTracks();
      this.started = true;
      this.offset = this.audioContext.currentTime;
    }
    this.updatePlayer();
  }

  startTracks() {
    this.audioStreams.forEach(item => {
      this.startTrack(item);        
    })
  }

  private startTrack(item: AudioStream) {
    if (this.offset === 0) {
      item.source.start();
    } else {
      item.source.start(0, this.audioContext.currentTime - this.offset);
    }
  }

  setGain(id: string, gain: number) {
    const audioStream = this.audioStreams.get(id);
    if (audioStream) {
      audioStream.gainNode.gain.value = gain;
    }
  }

  setPan(id: string, pan: number) {
    const audioStream = this.audioStreams.get(id);
    if (audioStream) {
      audioStream.panNode.pan.value = pan;
    }
  }

  async load(tracks: AudioTrack[]) {
    const previousStreams = [...this.audioStreams.values()];
    previousStreams.forEach((item) => {
      item.trackNode.disconnect();
      this.audioStreams.delete(item.id);
    });
    this.audioStreams.clear();
    this.audioContext.suspend();
    this.offset = 0;
    this.started = false;
    this.playerReady.set(false);

    //https://github.com/cwilso/Audio-Input-Effects/tree/main
    const promises = tracks.map(async (track) => {
      const id = track.fileRef.id;
      if (this.audioStreams.get(id)) {
        return;
      }
      const arrayBuffer = await this.fileService.getArrayBuffer(
        track.fileRef.id
      );
      if (!arrayBuffer) {
        return;
      }

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = track.volume;

      const panNode = this.audioContext.createStereoPanner();
      panNode.pan.value = track.pan;

      const trackNode = source.connect(gainNode).connect(panNode);
      trackNode.connect(this.audioContext.destination);

      const audioStream: AudioStream = {
        id,
        audioBuffer,
        source,
        gainNode,
        panNode,
        trackNode,
      };
      this.audioStreams.set(track.fileRef.id, audioStream);
    });
    await Promise.all(promises);

    this.playerReady.set(true);

    this.updatePlayer();
  }

  pause() {
    this.audioContext.suspend();
    this.updatePlayer();
  }

  // private trackPlayer() {
  //   if (!this.isPlaying()) return;
  //   this.updatePlayer();
  //   requestAnimationFrame(() => this.trackPlayer());
  // }

  private updatePlayer() {
    this.updateTime();
    this.updateIsPlaying();
  }

  private updateTime() {
    // this.currentTime.set(this.audioContext.currentTime - this.offset);
  }

  private updateIsPlaying() {
    this.isPlaying.set(this.audioContext.state === "running");
  }
}
