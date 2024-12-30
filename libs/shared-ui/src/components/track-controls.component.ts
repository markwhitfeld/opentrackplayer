import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AudioFile } from '../../../audio-core';

@Component({
  selector: 'app-track-controls',
  standalone: true,
  imports: [MatSliderModule, MatButtonModule, MatIconModule],
  template: `
    <div class="track-controls">
      <span class="track-name">{{ track.name }}</span>
      
      <mat-slider class="volume-slider">
        <input matSliderThumb
               [value]="track.volume"
               (valueChange)="volumeChange.emit($event)">
      </mat-slider>
      
      <mat-slider class="pan-slider">
        <input matSliderThumb
               [min]="-1"
               [max]="1"
               [step]="0.1"
               [value]="track.pan"
               (valueChange)="panChange.emit($event)">
      </mat-slider>
      
      <button mat-icon-button
              [color]="track.muted ? 'warn' : ''"
              (click)="muteToggle.emit()">
        <mat-icon>{{ track.muted ? 'volume_off' : 'volume_up' }}</mat-icon>
      </button>
      
      <button mat-icon-button
              [color]="track.soloed ? 'accent' : ''"
              (click)="soloToggle.emit()">
        <mat-icon>headphones</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .track-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .track-name {
      min-width: 120px;
    }
    
    .volume-slider {
      width: 100px;
    }
    
    .pan-slider {
      width: 80px;
    }
  `]
})
export class TrackControlsComponent {
  @Input({ required: true }) track!: AudioFile;
  @Output() volumeChange = new EventEmitter<number>();
  @Output() panChange = new EventEmitter<number>();
  @Output() muteToggle = new EventEmitter<void>();
  @Output() soloToggle = new EventEmitter<void>();
}