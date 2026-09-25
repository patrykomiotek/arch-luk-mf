import { Routes } from '@angular/router';

/**
 * To jest to, co `federation.config.js` wystawia jako `./Routes`.
 * Shell ładuje ten plik w czasie działania, nie w czasie budowania.
 */
export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./flight-search').then((m) => m.FlightSearch),
  },
];
