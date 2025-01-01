import {
  Component,
  output,
  input,
} from "@angular/core";
import { MatSliderModule, MatSliderThumb } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AudioTrack } from "../../../state";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-track-controls",
  standalone: true,
  imports: [
    MatSliderModule,
    MatSliderThumb,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  template: `
    <div class="track-controls">
      <span class="track-name"
        >{{ track().fileRef.name
        }}{{ !track().fileRef.dataLoaded ? "(Loading)" : "" }}</span
      >

      <button
        mat-icon-button
        [color]="track().muted ? 'warn' : ''"
        (click)="muteToggle.emit()"
      >
        <mat-icon>{{ track().muted ? "volume_off" : "volume_up" }}</mat-icon>
      </button>

      <mat-slider
        class="volume-slider"
        [min]="0"
        [max]="1"
        [step]="0.1"
        discrete
        [disabled]="track().muted"
      >
        <input
          matSliderThumb
          [value]="track().volume"
          (valueChange)="volumeChange.emit($event)"
        />
      </mat-slider>

      <!--mat-slider class="pan-slider" [min]="-1" [max]="1" [step]="0.1" discrete>
        <input
          matSliderThumb
          [value]="track().pan"
          (valueChange)="panChange.emit($event)"
        />
      </mat-slider-->

      <mat-button-toggle-group
        [value]="track().pan"
        (change)="panChange.emit($event.value)"
        aria-label="Pan"
        [hideSingleSelectionIndicator]="true"
        [disabled]="track().muted"
      >
        <mat-button-toggle [value]="-1">Left</mat-button-toggle>
        <!--mat-button-toggle value="0">Center</mat-button-toggle-->
        <mat-button-toggle [value]="1">Right</mat-button-toggle>
      </mat-button-toggle-group>

      <button
        *ngIf="false"
        mat-icon-button
        [color]="track().soloed ? 'accent' : ''"
        (click)="soloToggle.emit()"
      >
        <mat-icon>headphones</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
})
export class TrackControlsComponent {
  track = input.required<AudioTrack>();
  volumeChange = output<number>();
  panChange = output<number>();
  muteToggle = output<void>();
  soloToggle = output<void>();
}
