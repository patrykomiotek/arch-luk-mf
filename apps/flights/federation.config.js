const { withNativeFederation, shareAll } =
  require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'flights',

  // Co ten mikrofrontend udostępnia na zewnątrz. To jest jego PUBLICZNY
  // KONTRAKT - wszystko poza tą listą jest jego prywatną sprawą.
  exposes: {
    './Routes': './apps/flights/src/app/flights.routes.ts',
  },

  // Angular MUSI być singletonem. Dwie instancje @angular/core w jednej
  // stronie dają błędy wyglądające na magię, bo DI i router przestają się
  // rozumieć.
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  // Pakiety, których NIE współdzielimy. `shareAll` bierze wszystko z
  // package.json, łącznie z tym, czego nie używamy - a każdy taki wpis
  // musi się dać rozwiązać, inaczej build federacji pada.
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],
});
