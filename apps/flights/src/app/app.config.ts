import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { FLIGHT_ROUTES } from './flights.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(FLIGHT_ROUTES)],
};
