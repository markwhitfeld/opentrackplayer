import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngxs/store';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AudioState, PlayerState } from '../libs/state';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore([AudioState, PlayerState])
  ]
}).catch(err => console.error(err));