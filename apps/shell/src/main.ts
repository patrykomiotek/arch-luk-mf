import { initFederation } from '@angular-architects/native-federation';

// Federacja MUSI wystartować przed aplikacją - dlatego bootstrap jest
// w osobnym pliku i ładowany dynamicznie dopiero po `initFederation`.
initFederation('/federation.manifest.json')
  .catch((err) => console.error('Nie udało się zainicjować federacji', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
