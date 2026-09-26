---
title: 'Skrypt typu, którego przeglądarka nie zna, jest ignorowany po cichu'
areas: ['federacja']
topics: ['native-federation', 'polyfills', 'fail-silent']
---

# Skrypt typu, którego przeglądarka nie zna, jest ignorowany po cichu

**Kontekst**: składanie shella i remote'a na Native Federation od zera,
bez użycia `ng add` (który normalnie dopisuje polyfill sam).

**Problem**: shell zwracał **HTTP 200**, w `<body>` było poprawne
`<app-root></app-root>` oraz `<script type="module-shim" src="main.js">`,
a strona była **pusta**. W konsoli nie było **żadnego** błędu - tylko
`[vite] connected.`

Native Federation działa w trybie shim (`<script type="esms-options">{"shimMode":true}`).
Typ `module-shim` obsługuje dopiero biblioteka `es-module-shims`. Bez niej
przeglądarka widzi skrypt o nieznanym typie i **pomija go**, dokładnie tak
samo jak `<script type="text/template">`. Brak wykonania nie jest błędem,
więc nie ma czego zgłosić.

**Reguła**: `es-module-shims` musi być w `polyfills` każdej aplikacji
uczestniczącej w federacji:

```json
"polyfills": ["es-module-shims"]
```

Objaw „biała strona + zero błędów" przy Native Federation sprawdzaj **zawsze
najpierw tak**: w konsoli wpisz `typeof importShim`. Jeśli `"undefined"` -
to jest ten błąd i nic innego nie trzeba badać.

**Dotyczy**: każdej aplikacji z `@angular-architects/native-federation`,
zwłaszcza konfigurowanej ręcznie zamiast przez `ng add`.
