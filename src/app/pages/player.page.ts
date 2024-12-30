import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { tracks } from '../../../libs/state';
import { TrackControlsComponent } from '../../../libs/shared-ui/src/components/track-controls.component';
import { FileService } from '../../../libs/file-management/src/file.service';
import * as Actions from '../../../libs/state/src/audio.actions';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TrackControlsComponent],
  template: `
    <div class="player-container">
      <div class="controls">
        <button mat-raised-button color="primary" (click)="loadFolder()">
          <mat-icon>folder_open</mat-icon>
          Load Folder
        </button>
        
        <button mat-icon-button (click)="togglePlayback()">
          <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
        </button>
      </div>
      
      <div class="tracks">
        @for (track of tracks(); track track.id) {
          <app-track-controls
            [track]="track"
            (volumeChange)="updateVolume(track.id, $event)"
            (panChange)="updatePan(track.id, $event)"
            (muteToggle)="toggleMute(track.id)"
            (soloToggle)="toggleSolo(track.id)"
          />
        }
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      padding: 1rem;
    }
    
    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .tracks {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class PlayerPage {
  private store = inject(Store);
  private fileService = inject(FileService);
  
  tracks = this.store.selectSignal(tracks);
  isPlaying = false;
  
  async loadFolder() {
    try {
      const dirHandle = await this.fileService.selectFolder();
      await this.store.dispatch(new Actions.LoadFolder(dirHandle));
    } catch (error) {
      console.error('Failed to load folder:', error);
    }
  }
  
  togglePlayback() {
    if (this.isPlaying) {
      this.store.dispatch(new Actions.PauseTracks());
    } else {
      this.store.dispatch(new Actions.PlayTracks());
    }
    this.isPlaying = !this.isPlaying;
  }
  
  updateVolume(trackId: string, volume: number) {
    this.store.dispatch(new Actions.UpdateTrackVolume(trackId, volume));
  }
  
  updatePan(trackId: string, pan: number) {
    this.store.dispatch(new Actions.UpdateTrackPan(trackId, pan));
  }
  
  toggleMute(trackId: string) {
    this.store.dispatch(new Actions.ToggleTrackMute(trackId));
  }
  
  toggleSolo(trackId: string) {
    this.store.dispatch(new Actions.ToggleTrackSolo(trackId));
  }
}