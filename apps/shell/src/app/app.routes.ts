import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home').then((m) => m.Home),
  },
  {
    path: 'flights',
    /**
     * Ładowanie DYNAMICZNE: nazwa remote'a jest kluczem w manifeście,
     * nie adresem w kodzie. Zmiana adresu między dev/stage/prod to
     * podmiana JSON-a, bez przebudowy shella.
     */
    loadChildren: () =>
      loadRemoteModule('flights', './Routes').then((m) => m.FLIGHT_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
