import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/player.page').then(m => m.PlayerPage)
  }
];