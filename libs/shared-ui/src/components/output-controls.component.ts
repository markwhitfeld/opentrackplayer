import { Component, output, input } from "@angular/core";
import { MatSliderModule, MatSliderThumb } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { TrackConfig } from "../../../state/src/presets/preset.models";

@Component({
  selector: "app-output-controls",
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
    <div class="output-controls" [class.vertical]="vertical()">
      <mat-slider
        class="volume-slider"
        [min]="0"
        [max]="100"
        [step]="5"
        discrete
        [disabled]="disabled()"
      >
        <input
          matSliderThumb
          [value]="trackConfig().volume * 100"
          (valueChange)="volumeChange.emit($event / 100)"
        />
      </mat-slider>

      <!--mat-slider class="pan-slider" [min]="-1" [max]="1" [step]="0.1" discrete>
        <input
          matSliderThumb
          [value]="trackConfig().pan"
          (valueChange)="panChange.emit($event)"
        />
      </mat-slider-->

      <mat-button-toggle-group
        [value]="trackConfig().pan"
        (change)="panChange.emit($event.value)"
        aria-label="Pan"
        [hideSingleSelectionIndicator]="true"
        [disabled]="disabled()"
      >
        <mat-button-toggle [value]="-1">Left</mat-button-toggle>
        <mat-button-toggle [value]="0">Both</mat-button-toggle>
        <mat-button-toggle [value]="1">Right</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [
    `
      .output-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
      }

      .vertical {
        display: flex;
        flex-direction: column;
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
export class OutputControlsComponent {
  trackConfig = input.required<TrackConfig>();
  disabled = input<boolean>(false);
  vertical = input<boolean>(false);
  volumeChange = output<number>();
  panChange = output<number>();
}
