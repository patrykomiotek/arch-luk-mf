const { withNativeFederation, shareAll } =
  require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',

  // Shell nic nie wystawia. Jest hostem - ale nie musi tak być:
  // aplikacja może być jednocześnie hostem i remote'em.
  exposes: {},

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
