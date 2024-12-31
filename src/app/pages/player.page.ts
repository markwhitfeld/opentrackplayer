import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store, dispatch, select } from '@ngxs/store';
import { isPlaying, playerReady, tracks } from '../../../libs/state';
import { TrackControlsComponent } from '../../../libs/shared-ui/src/components/track-controls.component';
import { FileService } from '../../../libs/file-management/src/file.service';
import * as AudioActions from '../../../libs/state/src/audio/audio.actions';
import * as PlayerActions from '../../../libs/state/src/player/player.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, TrackControlsComponent, CommonModule],
  template: `
    <div class="player-container">
      <div class="controls">
        <button mat-raised-button color="primary" (click)="loadFolder()">
          <mat-icon>folder_open</mat-icon>
          Load Folder
        </button>
        
        <button mat-icon-button (click)="togglePlayback()" [disabled]="!playerReady()">
          <mat-icon>{{ isPlaying() ? 'pause' : 'play_arrow' }}</mat-icon>
        </button>
        <mat-progress-spinner mode="indeterminate" *ngIf="!playerReady() && tracks().length"
          diameter="40">
        </mat-progress-spinner>
        
      </div>
      
      <div class="tracks">
        @for (track of tracks(); track track.fileRef.id) {
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

  tracks = select(tracks);
  isPlaying = select(isPlaying);
  playerReady = select(playerReady);

  async loadFolder() {
    try {
      const dirHandle = await this.fileService.selectFolder();
      await this.store.dispatch(new AudioActions.LoadFolder(dirHandle));
    } catch (error) {
      console.error('Failed to load folder:', error);
    }
  }

  togglePlayback() {
    if (this.isPlaying()) {
      this.store.dispatch(new PlayerActions.PauseTracks());
    } else {
      this.store.dispatch(new PlayerActions.PlayTracks());
    }
  }

  updateVolume = dispatch(AudioActions.UpdateTrackVolume);
  updatePan = dispatch(AudioActions.UpdateTrackPan);
  toggleMute = dispatch(AudioActions.ToggleTrackMute);
  toggleSolo = dispatch(AudioActions.ToggleTrackSolo);
}