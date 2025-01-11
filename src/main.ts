import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideStore } from "@ngxs/store";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { AudioState, PlayerState } from "../libs/state";
import { inject, provideAppInitializer } from "@angular/core";
import { AudioDirectorService } from "./app/services/audio-director.service";
import { PresetState } from "../libs/state/src/presets/presets.state";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore([AudioState, PlayerState, PresetState]),
    provideAppInitializer(() => {
      const director = inject(AudioDirectorService);
      director.start();
    }),
  ],
}).catch((err) => console.error(err));
